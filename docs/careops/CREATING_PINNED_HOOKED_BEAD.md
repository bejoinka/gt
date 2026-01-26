# How to Create a Pinned Hooked Bead

A pinned hooked bead is permanent work that stays on your hook across sessions. Use this for role definitions, long-term projects, or ongoing responsibilities.

## Quick Steps

```bash
# 1. Create the bead (use type: role)
bd create -t role -l <labels> --title "TITLE" --body "$(cat <<'EOF'
<your bead content here>
EOF
)"

# 2. Pin it (sets permanent state)
bd set-state <bead-id> pin=permanent --reason "Reason for pinning"

# 3. Hook it
gt hook <bead-id>

# 4. Verify
gt hook
```

## Example

```bash
# Create a planner role bead
bd create -t role -l planner,studio --title "CREW/NAME: Planner Role" --body="$(cat <<'EOF'
My Planner Role

## Startup Protocol
Read docs/SOME_DOC.md before starting work.

## My Workflow
1. Assess current state
2. Wait for input
3. Create plans with beads and convoys
4. Notify mayor
EOF
)"

# Pin it (output shows bead ID like ca-abc)
bd set-state ca-abc pin=permanent --reason "Permanent planner role"

# Hook it
gt hook ca-abc
```

## What This Does

| Step | Effect |
|------|--------|
| `bd create` | Creates the bead with your content |
| `bd set-state pin=permanent` | Marks it as pinned (shows in `bd show` output) |
| `gt hook <id>` | Attaches to your hook, survives sessions/handoffs |

## Verifying It Worked

```bash
# Check hook status
gt hook

# Should show:
# 🪝 Hooked: <bead-id>: <title>
```

## Removing It Later

```bash
# Clear your hook
gt unhook
```

## Tips

- Use `-t role` for permanent role definitions
- Include **Startup Protocol** section with docs to read
- Include **Your Workflow** section with step-by-step instructions
- Include **Current Status** section (check with `bd show` or `gt convoy status`)
- Add `--label` for easy filtering (e.g., `-l planner,studio`)
