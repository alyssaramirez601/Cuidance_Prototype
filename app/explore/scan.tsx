import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';
import { scanCopy } from '@/data/exploreCopy';
import { isBarcode } from '@/lib/barcode';

const c = colors.light;

// Prototype screen 08B. Product barcodes only (EAN and UPC), and the camera stops after the first read
export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [typed, setTyped] = useState('');
  const [touched, setTouched] = useState(false);
  const handled = useRef(false);

  function open(code: string) {
    router.push({ pathname: '/explore/barcode/[code]', params: { code } });
  }

  function onScanned(result: BarcodeScanningResult) {
    if (handled.current || !isBarcode(result.data)) return;
    handled.current = true;
    open(result.data);
    // Lets them scan another product after coming back
    setTimeout(() => {
      handled.current = false;
    }, 2000);
  }

  const valid = isBarcode(typed);

  return (
    <Screen>
      <PageHeader title={scanCopy.title} intro={scanCopy.intro} backTo="/explore" />

      <View style={styles.cameraBox}>
        {permission?.granted ? (
          <>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
              onBarcodeScanned={onScanned}
              accessibilityLabel={scanCopy.aim}
            />
            <View style={styles.frame} pointerEvents="none" />
            <View style={styles.aim} pointerEvents="none">
              <Text style={styles.aimText}>{scanCopy.aim}</Text>
            </View>
          </>
        ) : (
          <View style={styles.permission}>
            <Text style={styles.permissionTitle}>{scanCopy.permissionTitle}</Text>
            <Text style={styles.permissionBody}>
              {permission && !permission.canAskAgain ? scanCopy.deniedBody : scanCopy.permissionBody}
            </Text>
            {!permission || permission.canAskAgain ? <Button label={scanCopy.allowCamera} onPress={requestPermission} /> : null}
          </View>
        )}
      </View>

      <Text style={styles.heading} accessibilityRole="header">
        {scanCopy.orType}
      </Text>
      <TextInput
        label={scanCopy.barcodeLabel}
        helper={scanCopy.barcodeHelper}
        value={typed}
        onChangeText={(text) => setTyped(text.replace(/\D/g, ''))}
        onBlur={() => setTouched(true)}
        error={touched && typed && !valid ? scanCopy.barcodeError : undefined}
        keyboardType="number-pad"
        returnKeyType="search"
        onSubmitEditing={() => valid && open(typed)}
        maxLength={14}
      />
      <Button label={scanCopy.lookUp} state={valid ? undefined : 'disabled'} onPress={() => open(typed)} />
      <Button label={scanCopy.enterManually} style="ghost" onPress={() => router.push('/explore/add-product')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraBox: {
    aspectRatio: 1,
    borderRadius: radius.medium,
    overflow: 'hidden',
    backgroundColor: c.brand,
  },
  // A wide box like a barcode, so it's clear what to line up
  frame: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    top: '34%',
    bottom: '34%',
    borderRadius: radius.small,
    borderWidth: stroke.strong,
    borderColor: c.onBrand,
  },
  aim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: space[16],
    alignItems: 'center',
  },
  aimText: {
    ...type.label,
    color: c.onBrand,
    paddingHorizontal: space[12],
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: c.brand,
    overflow: 'hidden',
  },
  permission: {
    flex: 1,
    justifyContent: 'center',
    gap: space[12],
    padding: layout.insideComponent,
    backgroundColor: c.surfaceWarm,
  },
  permissionTitle: {
    ...type.title,
    color: c.ink,
  },
  permissionBody: {
    ...type.body,
    color: c.ink,
  },
  heading: {
    ...type.title,
    color: c.ink,
  },
});
