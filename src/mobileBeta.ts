export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/sA9EznXr';

/** One delegated click event, for the Hero and Install sections; never includes an email. */
export function mobileInstallEvent(
  url: URL,
  placement: string,
): [string, Record<string, string>] | null {
  if (url.origin !== 'https://testflight.apple.com' || url.pathname !== '/join/sA9EznXr')
    return null;
  return ['mobile_install_clicked', { platform: 'ios', destination: 'testflight', placement }];
}
