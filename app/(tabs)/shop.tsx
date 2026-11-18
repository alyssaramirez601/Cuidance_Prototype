import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Note } from '@/components/Note';
import { PartnerOfferCard } from '@/components/PartnerOfferCard';
import { PartnerTile } from '@/components/PartnerTile';
import { Screen } from '@/components/Screen';
import { SwipeRow } from '@/components/SwipeRow';
import { Tabs } from '@/components/Tabs';
import { Toast } from '@/components/Toast';
import { colors, layout, space, type } from '@/constants/tokens';
import {
  partnerCollections,
  partnerOffers,
  partnerProducts,
  partnerWorkshops,
  shopCopy,
  type PartnerOffer,
} from '@/data/partnerContent';
import { collectionProducts, copyCode } from '@/lib/shop';

type ShopTab = 'all' | 'offers' | 'collections' | 'workshops';

const c = colors.light;

// Shop holds only labeled partner content, kept apart from guidance. No checkout:
// everything opens on the partner's site
export default function ShopScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<ShopTab>('all');
  const [toast, setToast] = useState('');

  async function onOffer(offer: PartnerOffer) {
    const copied = offer.code ? await copyCode(offer.code) : false;
    setToast(copied && offer.code ? shopCopy.codeCopied(offer.code) : shopCopy.noSite);
  }

  const offerCard = (offer: PartnerOffer) => (
    <PartnerOfferCard
      key={offer.id}
      eyebrow={shopCopy.kinds[offer.kind]}
      title={offer.title}
      meta={offer.meta}
      image={offer.image}
      code={offer.code}
      codeLabel={shopCopy.codeLabel}
      actionLabel={offer.code ? shopCopy.copyCode : shopCopy.openSite}
      onAction={() => onOffer(offer)}
    />
  );

  const openProduct = (id: string) => router.push({ pathname: '/shop/product/[id]', params: { id } });
  const openCollection = (id: string) => router.push({ pathname: '/shop/collection/[id]', params: { id } });

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        {shopCopy.title}
      </Text>
      <Note text={shopCopy.notice} />
      <Text style={styles.sample}>{shopCopy.sampleNote}</Text>
      <View style={styles.tabs}>
        <Tabs tabs={shopCopy.tabs} activeKey={tab} onChange={(key) => setTab(key as ShopTab)} />
      </View>
      {/* Toast has only success and error, so the no-site message uses the Note style instead */}
      {toast ? toast === shopCopy.noSite ? <Note text={toast} /> : <Toast type="success" message={toast} /> : null}

      {tab === 'all' ? (
        <>
          {offerCard(partnerOffers[0])}
          <SwipeRow title={shopCopy.productsRow}>
            {partnerProducts.map((product) => (
              <PartnerTile
                key={product.id}
                title={product.name}
                detail={product.brand}
                image={product.image}
                onPress={() => openProduct(product.id)}
              />
            ))}
          </SwipeRow>
          <SwipeRow title={shopCopy.collectionsRow} seeAllLabel={shopCopy.seeAll} onSeeAll={() => setTab('collections')}>
            {partnerCollections.map((collection) => {
              const items = collectionProducts(collection);
              return (
                <PartnerTile
                  key={collection.id}
                  title={collection.name}
                  detail={shopCopy.collectionCount(items.length, collection.detail)}
                  image={items[0].image}
                  onPress={() => openCollection(collection.id)}
                />
              );
            })}
          </SwipeRow>
          <SwipeRow title={shopCopy.workshopsRow} seeAllLabel={shopCopy.seeAll} onSeeAll={() => setTab('workshops')}>
            {partnerWorkshops.map((workshop) => (
              <PartnerTile
                key={workshop.id}
                title={workshop.title}
                detail={workshop.meta}
                image={workshop.image}
                onPress={() => setToast(shopCopy.noSite)}
              />
            ))}
          </SwipeRow>
        </>
      ) : null}

      {tab === 'offers' ? partnerOffers.map(offerCard) : null}

      {tab === 'collections' ? (
        <>
          <Text style={styles.intro}>{shopCopy.collectionsIntro}</Text>
          {partnerCollections.map((collection) => {
            const items = collectionProducts(collection);
            return (
              <PartnerTile
                key={collection.id}
                layout="banner"
                eyebrow={shopCopy.kinds.collection}
                title={collection.name}
                detail={shopCopy.collectionCount(items.length, collection.detail)}
                image={items[0].image}
                onPress={() => openCollection(collection.id)}
              />
            );
          })}
        </>
      ) : null}

      {tab === 'workshops' ? (
        <>
          <Text style={styles.intro}>{shopCopy.workshopsIntro}</Text>
          {partnerWorkshops.map((workshop) => (
            <PartnerTile
              key={workshop.id}
              layout="banner"
              eyebrow={shopCopy.kinds.workshop}
              title={workshop.title}
              detail={workshop.meta}
              image={workshop.image}
              onPress={() => setToast(shopCopy.noSite)}
            />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.heading,
    color: c.ink,
  },
  sample: {
    ...type.caption,
    color: c.inkMuted,
  },
  tabs: {
    marginHorizontal: -layout.screenEdge,
    paddingHorizontal: space[8],
  },
  intro: {
    ...type.body,
    color: c.inkMuted,
  },
});
