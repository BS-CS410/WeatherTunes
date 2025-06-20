# Playwright Test Failures: Prioritized Fix Plan

This document outlines a staged, prioritized plan to address the current Playwright test failures in the WeatherTunes authentication and error-handling suite. Each stage includes a description of the problem, the affected tests, and the recommended steps to resolve the issues.

---

## **Stage 1: Backend Error Code Corrections (Highest Impact, Quick Wins)**

### **Problem**
Many tests expect specific HTTP error codes (404, 500, 502, 503, 403) for various failure scenarios, but the backend currently returns 401 (Unauthorized) in these cases. This causes multiple unrelated tests to fail.

### **Affected Tests**
- `auth-error-handling.spec.ts` (404 handling)
- `backend-resilience.spec.ts` (rate limiting, storage/database failures, Spotify API integration)
- `player-edge-cases.spec.ts` (queue, playback, and device errors)

### **Actions**
1. **Audit backend endpoints** for error handling logic.
2. **Update backend to return correct HTTP status codes** for each failure scenario:
   - 404 for not found (e.g., missing track, device)
   - 500 for internal errors (e.g., storage/database failure)
   - 502/503 for upstream/temporary outages
   - 403 for forbidden actions (e.g., play/pause command failures)
3. **Add or update backend tests** to ensure correct status codes are returned.
4. **Rerun Playwright tests** to confirm fixes.

---

## **Stage 2: Frontend Request Management & Cleanup**

### **Problem**
Some frontend tests fail due to excessive or duplicate requests, lack of proper cleanup, or missing rate limiting.

### **Affected Tests**
- `frontend-state-management.spec.ts` (auth deduplication, useEffect cleanup, rate limiting)

### **Actions**
1. **Implement request deduplication** for concurrent auth/API requests.
2. **Add throttling or debouncing** to limit rapid or duplicate requests.
3. **Ensure proper cleanup** of event listeners, timers, and player services on component unmount.
4. **Review and optimize useEffect hooks** to prevent race conditions and excessive navigation events.
5. **Rerun Playwright tests** to confirm fixes.

---

## **Stage 3: Backend Rate Limiting & Failure Simulation**

### **Problem**
Some tests expect backend rate limiting or simulated failures (e.g., Spotify API rate limiting, storage outages), but the backend does not currently simulate these scenarios.

### **Affected Tests**
- `backend-resilience.spec.ts` (rate limiting, recovery from outages)
- `auth-error-handling.spec.ts` (network error resilience)

### **Actions**
1. **Implement or mock rate limiting** in backend endpoints (e.g., return 429 or custom error after N requests).
2. **Add simulation endpoints or test hooks** to trigger storage/database/Spotify API failures for testing.
3. **Update Playwright tests** to use these simulation hooks if needed.
4. **Rerun Playwright tests** to confirm fixes.

---

## **Stage 4: Test Adjustments & Documentation**

### **Problem**
Some test failures may be due to mismatches between test expectations and actual backend/frontend logic.

### **Affected Tests**
- Any remaining failures after Stages 1–3

### **Actions**
1. **Review failing tests** for outdated or overly strict assertions.
2. **Update test assertions** to match the intended, correct behavior of the app.
3. **Document any intentional deviations** from the original test expectations.
4. **Ensure all tests are clear, concise, and maintainable.**

---

## **Summary Table**

| Stage | Area                | Main Fixes                                 | Priority |
|-------|---------------------|--------------------------------------------|----------|
| 1     | Backend             | Correct HTTP error codes                   | High     |
| 2     | Frontend            | Request deduplication, cleanup, rate limit | High     |
| 3     | Backend             | Rate limiting, failure simulation          | Medium   |
| 4     | Tests/Docs          | Test updates, documentation                | Medium   |

---

**Recommendation:**
- Start with backend error code corrections (Stage 1) for the fastest and broadest test recovery.
- Proceed to frontend request management (Stage 2) to address state and performance issues.
- Implement backend rate limiting and failure simulation (Stage 3) for full resilience coverage.
- Finally, review and update tests/documentation (Stage 4) for long-term maintainability.
