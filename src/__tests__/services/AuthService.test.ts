import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../services/AuthService';

vi.mock('../../lib/cryptoUtils', () => ({
  generateRandomString: vi.fn().mockReturnValue('test_code_verifier'),
  generateCodeChallenge: vi.fn().mockResolvedValue('test_code_challenge'),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  it('calls localStorage.setItem with the code verifier during login', async () => {
    const CODE_VERIFIER_KEY = 'spotify_code_verifier';
    await authService.startLogin();
    expect(window.localStorage.setItem).toHaveBeenCalledWith(CODE_VERIFIER_KEY, expect.any(String));
  });
});

