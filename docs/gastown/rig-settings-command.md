# Rig Settings Command

> Implementation plan for `gt rig settings` - a generic CLI for editing rig settings.
> Created: 2025-01-26

## Problem Statement

Currently, editing `~/gt/<rig>/settings/config.json` (RigSettings) requires hand-editing JSON.

Some fields have dedicated commands:
- `gt rig theme set <rig> <name>` → edits `theme.name`
- `gt rig namepool set <rig> <style>` → edits `namepool.style`

But most fields don't:
- `agent` - default agent for this rig
- `role_agents.*` - per-role agent mapping
- `crew.startup` - crew auto-start configuration
- `workflow.default_formula` - default formula
- `merge_queue.*` - merge queue settings
- `agents.*` - custom agent definitions

This is confusing because:
1. Users don't know which file is being edited (wisp/bead layers vs `settings/config.json`)
2. Inconsistent UX - some settings have commands, others require JSON editing
3. New users don't know how to configure per-rig agent selection

## Clarification: Two Different "Config" Systems

Gas Town has **two distinct configuration systems** that users often confuse:

| System | Command | Location | Scope |
|--------|---------|----------|-------|
| **Property Layers** | `gt rig config set/show/unset` | Wisp + Rig Bead Labels | Operational state (status, auto_restart, etc.) |
| **Rig Settings** | `gt rig settings set/show/unset` (NEW) | `settings/config.json` | Behavioral configuration (agents, theme, etc.) |

The property layers system is for **runtime operational state** (is this rig parked? should it auto-restart?). The rig settings file is for **behavioral configuration** (which agent does this rig use? what theme?).

Both are useful, but they serve different purposes.

## Proposed Solution

Add a `gt rig settings` command that creates/edits `~/gt/<rig>/settings/config.json`:

```bash
# Show all settings
gt rig settings show <rig>

# Set simple values (string, bool, number)
gt rig settings set gastown agent cursor
gt rig settings set gastown role_agents.witness claude-haiku
gt rig settings set gastown crew.startup "max"

# Set complex values (JSON string)
gt rig settings set gastown merge_queue '{"enabled":true,"target_branch":"main"}'
gt rig settings set gastown agents.my-opus '{"command":"claude","args":["--model","opus"]}'

# Unset/remove a setting
gt rig settings unset gastown agent
```

## Key Paths (Dot Notation)

Support for nested keys using dot notation:

| Key Path | Type | Example Value | Notes |
|----------|------|---------------|-------|
| `agent` | string | `cursor` | Default agent for rig |
| `role_agents.witness` | string | `claude-haiku` | Agent for witness role |
| `role_agents.refinery` | string | `claude-sonnet` | Agent for refinery role |
| `role_agents.polecat` | string | `gemini` | Agent for polecats |
| `role_agents.crew` | string | `cursor` | Agent for crew members |
| `crew.startup` | string | `max` | Which crew to auto-start |
| `theme.name` | string | `ocean` | Tmux theme name |
| `theme.role_themes.witness` | string | `rust` | Per-role theme override |
| `namepool.style` | string | `mad-max` | Polecat name theme |
| `namepool.names` | JSON array | `["max","nux"]` | Custom name list |
| `workflow.default_formula` | string | `mol-work` | Default formula |
| `merge_queue` | JSON object | See below | Full merge queue config |
| `agents.<name>` | JSON object | See below | Custom agent definition |

### Complex Values (JSON String)

For complex nested structures, pass a JSON string:

```bash
# Merge queue config
gt rig settings set gastown merge_queue '{
  "enabled": true,
  "target_branch": "main",
  "integration_branches": true,
  "on_conflict": "assign_back"
}'

# Custom agent definition
gt rig settings set gastown agents.my-opus '{
  "command": "claude",
  "args": ["--model", "opus"],
  "env": {"ANTHROPIC_MODEL": "claude-3-5-opus-20250101"}
}'
```

## Behavior

### File Creation

If `~/gt/<rig>/settings/config.json` doesn't exist, the `set` command creates it with a valid `RigSettings` scaffold:

```json
{
  "type": "rig-settings",
  "version": 1
}
```

### Type Handling

The command attempts to parse values as:
1. **Boolean** - `true`, `false`
2. **Number** - integers and floats
3. **JSON** - if value starts with `{` or `[`
4. **String** - fallback

```bash
gt rig settings set gastown some_flag true      # bool
gt rig settings set gastown max_polecats 5      # number
gt rig settings set gastown my_list '["a","b"]' # JSON array
gt rig settings set gastown agent cursor        # string
```

### Merge Behavior

Setting a nested key preserves other values in that object:

```bash
# Before: {"role_agents": {"witness": "haiku"}}
gt rig settings set gastown role_agents.polecat gemini
# After:  {"role_agents": {"witness": "haiku", "polecat": "gemini"}}
```

## Deprecation Plan

### Phase 1: Add New Command

Add `gt rig settings` with full functionality.

### Phase 2: Mark Old Commands as Deprecated

Add deprecation notices to:
- `gt rig theme set` → use `gt rig settings set <rig> theme.name <value>`
- `gt rig namepool set` → use `gt rig settings set <rig> namepool.style <value>`

### Phase 3: Remove Old Commands

In a future major version, remove the deprecated commands.

## Implementation

### Files to Create

- `internal/cmd/rig_settings.go` - New file with show/set/unset commands

### Files to Modify

- `internal/cmd/rig.go` - Add `rigSettingsCmd` to rig command group

### Helper Functions

```go
// In internal/cmd/rig_settings.go

func runRigSettingsShow(cmd *cobra.Command, args []string) error
func runRigSettingsSet(cmd *cobra.Command, args []string) error
func runRigSettingsUnset(cmd *cobra.Command, args []string) error

// Key path parsing
func parseKeyPath(key string) []string
func setNestedValue(settings *config.RigSettings, path []string, value interface{}) error
func getNestedValue(settings *config.RigSettings, path []string) (interface{}, error)
func deleteNestedKey(settings *config.RigSettings, path []string) error
```

### Dependencies

Uses existing helpers from `internal/config/loader.go`:
- `config.LoadRigSettings(path)` - Load or returns error if not found
- `config.SaveRigSettings(path, settings)` - Save with directory creation
- `config.NewRigSettings()` - Create fresh scaffold
- `config.RigSettingsPath(rigPath)` - Get the file path

## Testing

### Unit Tests

- `TestParseKeyPath` - Dot notation parsing
- `TestSetNestedValue` - Setting nested struct values
- `TestDeleteNestedKey` - Removing nested keys
- `TestValueParsing` - Bool/number/JSON/string detection

### Integration Tests

- Set string value, verify file created/updated
- Set nested value, verify merge behavior
- Unset value, verify key removed
- Show command displays all settings
- Invalid key path returns helpful error

## Examples

### Setting Per-Rig Agent

```bash
# Before: settings/config.json doesn't exist
gt rig settings set careops agent cursor

# After:
{
  "type": "rig-settings",
  "version": 1,
  "agent": "cursor"
}
```

### Configuring Role Agents

```bash
gt rig settings set careops role_agents.witness claude-haiku
gt rig settings set careops role_agents.polecat gemini

# Result:
{
  "type": "rig-settings",
  "version": 1,
  "role_agents": {
    "witness": "claude-haiku",
    "polecat": "gemini"
  }
}
```

### Defining a Custom Agent

```bash
gt rig settings set careops agents.my-opus '{
  "command": "claude",
  "args": ["--model", "opus"],
  "env": {"ANTHROPIC_MODEL": "claude-3-5-opus-20250101"}
}'
```

### Viewing All Settings

```bash
gt rig settings show careops
```

Output:
```
careops settings (~/gt/careops/settings/config.json):

agent:            cursor
crew.startup:
theme.name:       ocean
namepool.style:   mad-max
role_agents:
  witness:        claude-haiku
  polecat:        gemini
```

## Related Documents

- `property-layers.md` - The OTHER config system (operational state)
- `internal/config/types.go` - RigSettings struct definition
- `internal/cmd/theme.go` - Existing theme command (to be deprecated)
- `internal/cmd/namepool.go` - Existing namepool command (to be deprecated)
