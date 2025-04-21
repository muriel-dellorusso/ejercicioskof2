import { resolve } from 'path'
import { defineConfig } from 'vite'

const root=resolve(__dirname,'src')
const outDir=resolve(__dirname,'dist')
export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir:true,
    rollupOptions: {
      input: {
        // Casita español
        casitadigital: resolve(root, 'casitadigital/index.html'),
        casitadigitalE1: resolve(root, 'casita_digital_E1/index.html'),
        casitadigitalE2: resolve(root, 'casita_digital_E2/index.html'),
        casitadigital01: resolve(root, 'casita_digital_01/index.html'),
        casitadigital02: resolve(root, 'casita_digital_02/index.html'),
        casitadigital03: resolve(root, 'casita_digital_03/index.html'),
        casitadigital04: resolve(root, 'casita_digital_04/index.html'),
        casitadigital05: resolve(root, 'casita_digital_05/index.html'),
        casitadigital06: resolve(root, 'casita_digital_06/index.html'),
        casitadigital07: resolve(root, 'casita_digital_07/index.html'),
        casitadigital08: resolve(root, 'casita_digital_08/index.html'),
        casitacompleja: resolve(root, 'casitacompleja/index.html'),
        demoCasitaSimple01: resolve(root, 'demoCasitaSimple01/index.html'),
        demoCasitaPalabras01: resolve(root, 'demoCasitaPalabras01/index.html'),
        // laberinto
        demoCreadorLaberinto: resolve(root, 'demoCreadorLaberinto/index.html'),
        demoDragAndDivide: resolve(root, 'demo_drag_and_divide/index.html'),
        demoDragAndJoin: resolve(root, 'demo_drag_and_join/index.html'),
        // ex geniallys, modelos/infografías interactivas --> iframe
        // español
        kof1v01es0101: resolve(root, 'kof1_v01_es_01_01/index.html'),
        kof1v01es0103: resolve(root, 'kof1_v01_es_01_03/index.html'),
        kof1v01es0201: resolve(root, 'kof1_v01_es_02_01/index.html'),
        kof1v01es0202: resolve(root, 'kof1_v01_es_02_02/index.html'),
        kof1v01es0203: resolve(root, 'kof1_v01_es_02_03/index.html'),
        kof1v01es0301: resolve(root, 'kof1_v01_es_03_01/index.html'),
        kof1v01es0302: resolve(root, 'kof1_v01_es_03_02/index.html'),
        // ingles
        kof1v01en0101: resolve(root, 'kof1_v01_en_01_01/index.html'),
        kof1v01en0103: resolve(root, 'kof1_v01_en_01_03/index.html'),
        kof1v01en0201: resolve(root, 'kof1_v01_en_02_01/index.html'),
        kof1v01en0202: resolve(root, 'kof1_v01_en_02_02/index.html'),
        kof1v01en0203: resolve(root, 'kof1_v01_en_02_03/index.html'),
        kof1v01en0301: resolve(root, 'kof1_v01_en_03_01/index.html'),
        kof1v01en0302: resolve(root, 'kof1_v01_en_03_02/index.html'),

        // casita inglés
        casitadigitalEN: resolve(root, 'casitadigital_en/index.html'),
        casitadigitalE1EN: resolve(root, 'casita_digital_E1_en/index.html'),
        casitadigitalE2EN: resolve(root, 'casita_digital_E2_en/index.html'),
        casitadigital01EN: resolve(root, 'casita_digital_01_en/index.html'),
        casitadigital02EN: resolve(root, 'casita_digital_02_en/index.html'),
        casitadigital03EN: resolve(root, 'casita_digital_03_en/index.html'),
        casitadigital04EN: resolve(root, 'casita_digital_04_en/index.html'),
        casitadigital05EN: resolve(root, 'casita_digital_05_en/index.html'),
        casitadigital06EN: resolve(root, 'casita_digital_06_en/index.html'),
        casitadigital07EN: resolve(root, 'casita_digital_07_en/index.html'),
        casitadigital08EN: resolve(root, 'casita_digital_08_en/index.html'),
        casitacomplejaEN: resolve(root, 'casitacompleja_en/index.html'),

        // IAP es
        iaprimaria2ES: resolve(root, 'IAP_es_02_02/index.html'),
        iaprimaria4ES: resolve(root, 'IAP_es_04_01/index.html'),

        //IAS es

        iasecundaria7ES: resolve(root, 'IAS_es_07_01/index.html'),

        // IAP en
        iaprimaria2EN: resolve(root, 'IAP_en_02_02/index.html'),
        iaprimaria4EN: resolve(root, 'IAP_en_04_01/index.html'),

        //IAS en
        iasecundaria7EN: resolve(root, 'IAS_en_07_01/index.html'),

      },
    },
  },
  base:'/miscelaneas/',
})