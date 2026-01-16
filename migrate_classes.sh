#!/bin/bash

# Migration script to replace hardcoded Tailwind classes with design token-based classes

find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-blue-500/bg-accent-primary/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-blue-600/bg-accent-secondary/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-blue-700/bg-accent-tertiary/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-gray-600/text-neutral-600/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-gray-700/text-neutral-700/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/border-gray-200/border-neutral-200/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/border-gray-300/border-neutral-300/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-green-500/bg-semantic-success/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-green-600/text-semantic-success/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-red-500/bg-semantic-error/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-red-600/text-semantic-error/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-yellow-500/bg-semantic-warning/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-yellow-600/text-semantic-warning/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-cyan-500/bg-semantic-info/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-cyan-600/text-semantic-info/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-white/text-primary-foreground/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/bg-white/bg-background/g' {} \;
find /Users/julianclarkson/Documents/opuszero/src -name '*.tsx' -exec sed -i 's/text-black/text-foreground/g' {} \;

echo "Migration completed"
