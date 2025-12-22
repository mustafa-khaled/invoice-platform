#!/bin/bash

# TypeScript and Build Verification Script
# This script verifies that all TypeScript errors are resolved

echo "🔍 Starting TypeScript Verification..."
echo ""

# Step 1: Check Prisma Client Generation
echo "📦 Step 1: Verifying Prisma Client..."
if pnpm db:generate > /dev/null 2>&1; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Prisma Client generation failed"
    exit 1
fi
echo ""

# Step 2: Run TypeScript Type Check
echo "🔎 Step 2: Running TypeScript type check..."
if npx tsc --noEmit; then
    echo "✅ No TypeScript errors found"
else
    echo "❌ TypeScript errors detected"
    exit 1
fi
echo ""

# Step 3: Run Production Build
echo "🏗️  Step 3: Running production build..."
if pnpm build > /dev/null 2>&1; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi
echo ""

echo "🎉 All checks passed! Your application is ready for deployment."
echo ""
echo "Summary:"
echo "  ✅ Prisma Client: Generated"
echo "  ✅ TypeScript: No errors"
echo "  ✅ Build: Successful"
