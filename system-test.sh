#!/bin/bash

# ============================================================================
# ROUTIEX TERMINAL PRO - AUTOMATED SYSTEM TESTING SCRIPT
# Version: 1.0
# Description: Comprehensive automated testing for system health
# ============================================================================

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
    ((WARNINGS++))
}

log_section() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Test results file
RESULTS_FILE="TEST_RESULTS_$(date +%Y%m%d_%H%M%S).md"

# Start testing
clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      ROUTIEX TERMINAL PRO - SYSTEM TESTING SUITE         ║"
echo "║                     Version 4.5.0                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Initialize results file
cat > "$RESULTS_FILE" << EOF
# ROUTIEX TERMINAL PRO - TEST RESULTS
**Test Date:** $(date)  
**Tester:** Automated Script  
**Version:** 4.5.0

---

## TEST EXECUTION SUMMARY

EOF

# ============================================================================
# TEST PHASE 1: ENVIRONMENT & DEPENDENCIES
# ============================================================================

log_section "PHASE 1: ENVIRONMENT & DEPENDENCIES"

# Test 1.1: Node.js Version
log_info "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        log_success "Node.js version: $NODE_VERSION (✓ >=18)"
    else
        log_error "Node.js version too old: $NODE_VERSION (requires >=18)"
    fi
else
    log_error "Node.js not found"
fi

# Test 1.2: npm availability
log_info "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm version: $NPM_VERSION"
else
    log_error "npm not found"
fi

# Test 1.3: Check package.json exists
log_info "Checking package.json..."
if [ -f "package.json" ]; then
    log_success "package.json exists"
else
    log_error "package.json not found"
fi

# Test 1.4: Check node_modules
log_info "Checking dependencies installation..."
if [ -d "node_modules" ]; then
    log_success "node_modules directory exists"
else
    log_warning "node_modules not found - run 'npm install'"
fi

# Test 1.5: Check .env.local for API key
log_info "Checking API key configuration..."
if [ -f ".env.local" ]; then
    if grep -q "GEMINI_API_KEY" .env.local; then
        log_success ".env.local contains GEMINI_API_KEY"
    else
        log_warning ".env.local exists but missing GEMINI_API_KEY"
    fi
else
    log_warning ".env.local not found - create it with GEMINI_API_KEY"
fi

# ============================================================================
# TEST PHASE 2: PROJECT STRUCTURE
# ============================================================================

log_section "PHASE 2: PROJECT STRUCTURE VALIDATION"

# Test 2.1: Core files
log_info "Checking core application files..."
CORE_FILES=("App.tsx" "index.tsx" "index.html" "vite.config.ts" "tsconfig.json" "types.ts")
for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "Found: $file"
    else
        log_error "Missing: $file"
    fi
done

# Test 2.2: Components directory
log_info "Checking components directory..."
if [ -d "components" ]; then
    COMPONENT_COUNT=$(ls -1 components/*.tsx 2>/dev/null | wc -l)
    if [ "$COMPONENT_COUNT" -gt 0 ]; then
        log_success "Found $COMPONENT_COUNT React components"
    else
        log_error "No components found in components/"
    fi
else
    log_error "components/ directory not found"
fi

# Test 2.3: Services directory
log_info "Checking services directory..."
if [ -d "services" ]; then
    if [ -f "services/geminiService.ts" ]; then
        log_success "geminiService.ts exists"
    else
        log_error "geminiService.ts missing"
    fi
else
    log_error "services/ directory not found"
fi

# Test 2.4: Utils directory
log_info "Checking utils directory..."
if [ -d "utils" ]; then
    if [ -f "utils/translations.ts" ]; then
        log_success "translations.ts exists"
    else
        log_error "translations.ts missing"
    fi
else
    log_error "utils/ directory not found"
fi

# ============================================================================
# TEST PHASE 3: CODE QUALITY
# ============================================================================

log_section "PHASE 3: CODE QUALITY CHECKS"

# Test 3.1: TypeScript Compilation
log_info "Running TypeScript compilation..."
if npm run build > /tmp/build.log 2>&1; then
    log_success "TypeScript compilation successful"
else
    log_error "TypeScript compilation failed (see /tmp/build.log)"
fi

# Test 3.2: ESLint
log_info "Running ESLint..."
if npm run lint > /tmp/lint.log 2>&1; then
    log_success "ESLint check passed"
else
    log_warning "ESLint warnings/errors found (see /tmp/lint.log)"
fi

# Test 3.3: Check for console.log statements (code smell)
log_info "Checking for debug console.log statements..."
CONSOLE_COUNT=$(grep -r "console\.log" components/ services/ utils/ 2>/dev/null | wc -l || echo 0)
if [ "$CONSOLE_COUNT" -eq 0 ]; then
    log_success "No console.log statements found"
else
    log_warning "Found $CONSOLE_COUNT console.log statements (consider removing for production)"
fi

# ============================================================================
# TEST PHASE 4: COMPONENT VALIDATION
# ============================================================================

log_section "PHASE 4: COMPONENT VALIDATION"

# Test 4.1: Check critical components exist
log_info "Verifying critical components..."
CRITICAL_COMPONENTS=(
    "App.tsx"
    "components/Header.tsx"
    "components/Sidebar.tsx"
    "components/AuthFlow.tsx"
    "components/AiAnalyzerWidget.tsx"
    "components/TradingChart.tsx"
    "components/MarketCenter.tsx"
    "components/NewsTerminal.tsx"
)

for component in "${CRITICAL_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        log_success "Critical component exists: $component"
    else
        log_error "Missing critical component: $component"
    fi
done

# Test 4.2: Check component file sizes (detect bloat)
log_info "Checking component sizes..."
LARGE_FILES=$(find components/ -name "*.tsx" -size +50k 2>/dev/null)
if [ -z "$LARGE_FILES" ]; then
    log_success "No excessively large components (>50KB)"
else
    log_warning "Large components found (consider splitting):"
    echo "$LARGE_FILES"
fi

# ============================================================================
# TEST PHASE 5: DEPENDENCY ANALYSIS
# ============================================================================

log_section "PHASE 5: DEPENDENCY ANALYSIS"

# Test 5.1: Check all dependencies are installed
log_info "Verifying dependencies..."
REQUIRED_DEPS=("react" "react-dom" "@google/genai" "lucide-react" "recharts" "vite" "typescript")
for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" &> /dev/null; then
        log_success "Dependency installed: $dep"
    else
        log_error "Missing dependency: $dep"
    fi
done

# Test 5.2: Check for security vulnerabilities
log_info "Running npm audit..."
AUDIT_RESULT=$(npm audit --json 2>/dev/null || echo '{"vulnerabilities":{}}')
VULN_COUNT=$(echo "$AUDIT_RESULT" | grep -o '"vulnerabilities"' | wc -l || echo 0)
if [ "$VULN_COUNT" -eq 0 ]; then
    log_success "No known security vulnerabilities"
else
    log_warning "Security vulnerabilities found - run 'npm audit fix'"
fi

# ============================================================================
# TEST PHASE 6: GIT REPOSITORY
# ============================================================================

log_section "PHASE 6: GIT REPOSITORY"

# Test 6.1: Check if git is initialized
log_info "Checking git repository..."
if [ -d ".git" ]; then
    log_success "Git repository initialized"
    
    # Test 6.2: Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "Current branch: $CURRENT_BRANCH"
    
    # Test 6.3: Check for uncommitted changes
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        log_success "No uncommitted changes"
    else
        log_warning "Uncommitted changes detected"
    fi
    
    # Test 6.4: Check remote
    if git remote -v | grep -q "origin"; then
        log_success "Remote repository configured"
    else
        log_warning "No remote repository configured"
    fi
else
    log_warning "Not a git repository"
fi

# ============================================================================
# TEST PHASE 7: FILE INTEGRITY
# ============================================================================

log_section "PHASE 7: FILE INTEGRITY"

# Test 7.1: Check for empty files
log_info "Checking for empty TypeScript files..."
EMPTY_FILES=$(find . -name "*.tsx" -o -name "*.ts" | xargs -I{} sh -c '[ -s "{}" ] || echo "{}"')
if [ -z "$EMPTY_FILES" ]; then
    log_success "No empty TypeScript files"
else
    log_error "Empty files found: $EMPTY_FILES"
fi

# Test 7.2: Check imports in geminiService
log_info "Validating geminiService imports..."
if grep -q "import.*@google/genai" services/geminiService.ts 2>/dev/null; then
    log_success "Gemini SDK imported correctly"
else
    log_error "Gemini SDK import missing in geminiService.ts"
fi

# Test 7.3: Check for process.env.API_KEY usage
log_info "Checking API key usage..."
if grep -q "process\.env\.API_KEY" services/geminiService.ts 2>/dev/null; then
    log_success "API_KEY environment variable used correctly"
else
    log_error "API_KEY not properly configured in geminiService.ts"
fi

# ============================================================================
# TEST PHASE 8: CONFIGURATION FILES
# ============================================================================

log_section "PHASE 8: CONFIGURATION VALIDATION"

# Test 8.1: Validate tsconfig.json
log_info "Checking TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
    if grep -q '"jsx"' tsconfig.json && grep -q '"react"' tsconfig.json; then
        log_success "tsconfig.json properly configured for React"
    else
        log_warning "tsconfig.json may need JSX configuration"
    fi
fi

# Test 8.2: Validate vite.config.ts
log_info "Checking Vite configuration..."
if [ -f "vite.config.ts" ]; then
    if grep -q "@vitejs/plugin-react" vite.config.ts; then
        log_success "Vite configured with React plugin"
    else
        log_warning "React plugin may be missing from vite.config.ts"
    fi
fi

# Test 8.3: Check .gitignore
log_info "Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore && grep -q "dist" .gitignore && grep -q ".env.local" .gitignore; then
        log_success ".gitignore properly configured"
    else
        log_warning ".gitignore may be incomplete"
    fi
else
    log_error ".gitignore missing"
fi

# ============================================================================
# GENERATE RESULTS SUMMARY
# ============================================================================

log_section "TEST EXECUTION COMPLETE"

# Calculate pass rate
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS / $TOTAL_TESTS) * 100}")
else
    PASS_RATE="0.0"
fi

# Display summary
echo ""
echo "╔════════════════════════════════════════╗"
echo "║         TEST RESULTS SUMMARY           ║"
echo "╠════════════════════════════════════════╣"
printf "║ Total Tests:      %-20s ║\n" "$TOTAL_TESTS"
printf "║ Passed:           ${GREEN}%-20s${NC} ║\n" "$PASSED_TESTS"
printf "║ Failed:           ${RED}%-20s${NC} ║\n" "$FAILED_TESTS"
printf "║ Warnings:         ${YELLOW}%-20s${NC} ║\n" "$WARNINGS"
printf "║ Pass Rate:        %-20s ║\n" "$PASS_RATE%"
echo "╚════════════════════════════════════════╝"
echo ""

# Append summary to results file
cat >> "$RESULTS_FILE" << EOF
### Results
- **Total Tests:** $TOTAL_TESTS
- **Passed:** $PASSED_TESTS ✓
- **Failed:** $FAILED_TESTS ✗
- **Warnings:** $WARNINGS ⚠
- **Pass Rate:** $PASS_RATE%

---

## TEST PHASES

### Phase 1: Environment & Dependencies
- Node.js, npm, package.json, dependencies verification

### Phase 2: Project Structure
- Core files, components, services, utils validation

### Phase 3: Code Quality
- TypeScript compilation, ESLint, code smell detection

### Phase 4: Component Validation
- Critical components existence and size check

### Phase 5: Dependency Analysis
- Required packages and security audit

### Phase 6: Git Repository
- Repository status, branch, commits check

### Phase 7: File Integrity
- Empty files, import validation

### Phase 8: Configuration Files
- tsconfig.json, vite.config.ts, .gitignore validation

---

## RECOMMENDATIONS

EOF

# Add recommendations based on results
if [ $FAILED_TESTS -gt 0 ]; then
    echo "⚠️ **CRITICAL:** $FAILED_TESTS tests failed. Address these immediately." >> "$RESULTS_FILE"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "⚠️ **WARNING:** $WARNINGS warnings detected. Review and fix." >> "$RESULTS_FILE"
fi

if [ ! -f ".env.local" ]; then
    echo "🔑 **ACTION REQUIRED:** Create \`.env.local\` with \`GEMINI_API_KEY\`" >> "$RESULTS_FILE"
fi

if [ $PASS_RATE == "100.0" ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ **STATUS:** System is READY FOR DEPLOYMENT" >> "$RESULTS_FILE"
elif [ "$PASS_RATE" -ge "80" ]; then
    echo "✅ **STATUS:** System is FUNCTIONAL with minor issues" >> "$RESULTS_FILE"
else
    echo "❌ **STATUS:** System has CRITICAL ISSUES - fix before deployment" >> "$RESULTS_FILE"
fi

cat >> "$RESULTS_FILE" << EOF

---

**Test Completed:** $(date)  
**Log Files:**
- Build log: /tmp/build.log
- Lint log: /tmp/lint.log
EOF

echo ""
log_info "Results saved to: $RESULTS_FILE"
echo ""

# Return exit code based on failures
if [ $FAILED_TESTS -gt 0 ]; then
    exit 1
else
    exit 0
fi
