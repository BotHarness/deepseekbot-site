import { communityIconSvg, type CommunityBrand } from '../communityIcons';

export function CommunityIcon({ brand }: { brand: CommunityBrand }) {
  return (
    <span
      className="community-icon-wrap"
      aria-hidden="true"
      // Only trusted, locally defined pixel geometry is rendered.
      dangerouslySetInnerHTML={{ __html: communityIconSvg(brand) }}
    />
  );
}
