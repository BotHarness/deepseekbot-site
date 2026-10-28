export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/sA9EznXr';

/** One delegated click event, for the Hero and Install sections; never includes an email. */
export function mobileInstallEvent(
  url: URL,
  placement: string,
): ['mobile_beta:install_link_click', Record<string, string>] | null {
  if (url.origin !== 'https://testflight.apple.com' || url.pathname !== '/join/sA9EznXr')
    return null;
  return [
    'mobile_beta:install_link_click',
    { platform: 'ios', destination: 'testflight', placement },
  ];
}
