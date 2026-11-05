const staticAssetServerUrlForCN =
  'https://7072-prod-9goxmz5w39f71724-1308749526.tcb.qcloud.la/';

export async function getStaticAssetServerUrl() {
  const domain = window.location.href;
  if (domain.includes('github') || domain.includes('http://')) {
    return domain;
  }
  return staticAssetServerUrlForCN;
}

export const MPNameMap: Record<string, string | undefined> = {
  root: 'Estrutura principal',
  motherboard_mp: 'Placa-mãe',
  power_mp: 'Fonte de alimentação',
  fan1_mp: 'Ventoinha 1',
  fan2_mp: 'Ventoinha 2',
  fan3_mp: 'Ventoinha 3',
  fan4_mp: 'Ventoinha 4',
  fan5_mp: 'Ventoinha 5',
  nvmessd_mp1: 'SSD NVMe 1',
  nvmessd_mp2: 'SSD NVMe 2',
  cooler_mp: 'Cooler do processador',
  cpu_mp: 'Processador',
  pcie_mp: 'Placa de vídeo',
  ddr4_ram_mp1: 'Memória RAM DDR4 1',
  ddr4_ram_mp2: 'Memória RAM DDR4 2',
};
