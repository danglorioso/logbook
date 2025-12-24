import { NextRequest, NextResponse } from "next/server";

// Airport coordinates lookup
// This is a basic implementation - you may want to use a more comprehensive database
const AIRPORT_COORDS: Record<string, { lat: number; lng: number }> = {
  // Major US airports
  KJFK: { lat: 40.6413, lng: -73.7781 }, // New York JFK
  KLAX: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  KORD: { lat: 41.9742, lng: -87.9073 }, // Chicago O'Hare
  KATL: { lat: 33.6407, lng: -84.4277 }, // Atlanta
  KDFW: { lat: 32.8998, lng: -97.0403 }, // Dallas/Fort Worth
  KDEN: { lat: 39.8561, lng: -104.6737 }, // Denver
  KSFO: { lat: 37.6213, lng: -122.3790 }, // San Francisco
  KSEA: { lat: 47.4502, lng: -122.3088 }, // Seattle
  KMIA: { lat: 25.7959, lng: -80.2870 }, // Miami
  KBOS: { lat: 42.3656, lng: -71.0096 }, // Boston
  KIAD: { lat: 38.9531, lng: -77.4565 }, // Washington Dulles
  KEWR: { lat: 40.6895, lng: -74.1745 }, // Newark
  KPHX: { lat: 33.4342, lng: -112.0116 }, // Phoenix
  KLAS: { lat: 36.0840, lng: -115.1537 }, // Las Vegas
  KMSP: { lat: 44.8831, lng: -93.2218 }, // Minneapolis
  KDTW: { lat: 42.2162, lng: -83.3554 }, // Detroit
  KPHL: { lat: 39.8719, lng: -75.2411 }, // Philadelphia
  KCLT: { lat: 35.2144, lng: -80.9473 }, // Charlotte
  KHOU: { lat: 29.6454, lng: -95.2789 }, // Houston Hobby
  KIAH: { lat: 29.9902, lng: -95.3368 }, // Houston Intercontinental
  KSLC: { lat: 40.7899, lng: -111.9791 }, // Salt Lake City
  KBWI: { lat: 39.1774, lng: -76.6684 }, // Baltimore
  KSAN: { lat: 32.7338, lng: -117.1933 }, // San Diego
  KPDX: { lat: 45.5898, lng: -122.5951 }, // Portland
  KSTL: { lat: 38.7487, lng: -90.3700 }, // St. Louis
  KMCI: { lat: 39.2976, lng: -94.7139 }, // Kansas City
  KAUS: { lat: 30.1945, lng: -97.6699 }, // Austin
  KMSY: { lat: 29.9934, lng: -90.2581 }, // New Orleans
  KBNA: { lat: 36.1245, lng: -86.6782 }, // Nashville
  KRDU: { lat: 35.8776, lng: -78.7875 }, // Raleigh-Durham
  KTPA: { lat: 27.9755, lng: -82.5332 }, // Tampa
  KMCO: { lat: 28.4312, lng: -81.3083 }, // Orlando
  KFLL: { lat: 26.0726, lng: -80.1528 }, // Fort Lauderdale
  KMDW: { lat: 41.7868, lng: -87.7522 }, // Chicago Midway
  KISP: { lat: 40.7952, lng: -73.1002 }, // Long Island/Islip
  KBDL: { lat: 41.9389, lng: -72.6832 }, // Hartford
  KPVD: { lat: 41.7326, lng: -71.4204 }, // Providence
  KBUF: { lat: 42.9405, lng: -78.7322 }, // Buffalo
  KROC: { lat: 43.1189, lng: -77.6724 }, // Rochester
  KSYR: { lat: 43.1112, lng: -76.1063 }, // Syracuse
  KALB: { lat: 42.7483, lng: -73.8017 }, // Albany
  KBUR: { lat: 34.2006, lng: -118.3587 }, // Burbank
  KONT: { lat: 34.0560, lng: -117.6012 }, // Ontario
  KSNA: { lat: 33.6757, lng: -117.8682 }, // Orange County
  KSJC: { lat: 37.3626, lng: -121.9290 }, // San Jose
  KOAK: { lat: 37.7213, lng: -122.2207 }, // Oakland
  KSMO: { lat: 34.0158, lng: -118.4513 }, // Santa Monica
  KPAO: { lat: 37.4611, lng: -122.1150 }, // Palo Alto
  KNUQ: { lat: 37.4161, lng: -122.0491 }, // Moffett Field
  KSQL: { lat: 37.5119, lng: -122.2495 }, // San Carlos
  KHAF: { lat: 37.5134, lng: -122.5011 }, // Half Moon Bay
  KMRY: { lat: 36.5870, lng: -121.8429 }, // Monterey
  KSBA: { lat: 34.4262, lng: -119.8404 }, // Santa Barbara
  KSBP: { lat: 35.2370, lng: -120.6424 }, // San Luis Obispo
  KSMF: { lat: 38.6954, lng: -121.5908 }, // Sacramento
  KFAT: { lat: 36.7762, lng: -119.7181 }, // Fresno
  KBFL: { lat: 35.4336, lng: -119.0568 }, // Bakersfield
  KMMH: { lat: 37.6241, lng: -119.0820 }, // Mammoth Lakes
  KTVL: { lat: 38.8939, lng: -119.9953 }, // South Lake Tahoe
  KRNO: { lat: 39.4993, lng: -119.7681 }, // Reno
  KBOI: { lat: 43.5644, lng: -116.2228 }, // Boise
  KPDT: { lat: 45.6950, lng: -118.8414 }, // Pendleton
  KYKM: { lat: 46.5682, lng: -120.5440 }, // Yakima
  KGEG: { lat: 47.6199, lng: -117.5338 }, // Spokane
  KBLI: { lat: 48.7928, lng: -122.5375 }, // Bellingham
  KPSC: { lat: 46.2647, lng: -119.1190 }, // Pasco
  KALW: { lat: 46.0949, lng: -118.2880 }, // Walla Walla
  KPUW: { lat: 46.7439, lng: -117.1096 }, // Pullman
  KMSO: { lat: 46.9163, lng: -114.0906 }, // Missoula
  KBZN: { lat: 45.7775, lng: -111.1525 }, // Bozeman
  KBIL: { lat: 45.8077, lng: -108.5429 }, // Billings
  KGTF: { lat: 47.4820, lng: -111.3707 }, // Great Falls
  KHLN: { lat: 46.6068, lng: -111.9827 }, // Helena
  KBIS: { lat: 46.7727, lng: -100.7460 }, // Bismarck
  KFAR: { lat: 46.9207, lng: -96.8158 }, // Fargo
  KGFK: { lat: 47.9493, lng: -97.1761 }, // Grand Forks
  KDLH: { lat: 46.8421, lng: -92.1936 }, // Duluth
  KINL: { lat: 48.5662, lng: -93.4031 }, // International Falls
  KBJI: { lat: 47.5107, lng: -94.9337 }, // Bemidji
  KBRD: { lat: 46.3983, lng: -94.1381 }, // Brainerd
  KFCM: { lat: 44.8272, lng: -93.4571 }, // Flying Cloud
  KANE: { lat: 45.1450, lng: -93.2114 }, // Anoka County
  KSTP: { lat: 44.9345, lng: -93.0600 }, // St. Paul Downtown
  // Major international airports
  EGLL: { lat: 51.4700, lng: -0.4543 }, // London Heathrow
  LFPG: { lat: 49.0097, lng: 2.5479 }, // Paris Charles de Gaulle
  EDDF: { lat: 50.0379, lng: 8.5622 }, // Frankfurt
  LEMD: { lat: 40.4839, lng: -3.5680 }, // Madrid
  LIRF: { lat: 41.8045, lng: 12.2509 }, // Rome Fiumicino
  EHAM: { lat: 52.3105, lng: 4.7683 }, // Amsterdam
  EBBR: { lat: 50.9014, lng: 4.4844 }, // Brussels
  LSZH: { lat: 47.4647, lng: 8.5492 }, // Zurich
  LOWW: { lat: 48.1103, lng: 16.5697 }, // Vienna
  EKCH: { lat: 55.6180, lng: 12.6560 }, // Copenhagen
  ESSA: { lat: 59.6519, lng: 17.9186 }, // Stockholm
  ENGM: { lat: 60.1939, lng: 11.1004 }, // Oslo
  EFHK: { lat: 60.3172, lng: 24.9633 }, // Helsinki
  UUEE: { lat: 55.9726, lng: 37.4146 }, // Moscow Sheremetyevo
  UUDD: { lat: 55.4086, lng: 37.9061 }, // Moscow Domodedovo
  UUWW: { lat: 55.5915, lng: 37.2615 }, // Moscow Vnukovo
  ULLI: { lat: 59.8003, lng: 30.2625 }, // St. Petersburg
  UAAA: { lat: 43.3522, lng: 77.0405 }, // Almaty
  UAKK: { lat: 51.0222, lng: 71.4669 }, // Astana
  // Asia-Pacific
  RJTT: { lat: 35.5494, lng: 139.7798 }, // Tokyo Haneda
  RJAA: { lat: 35.7647, lng: 140.3863 }, // Tokyo Narita
  RKSI: { lat: 37.4602, lng: 126.4407 }, // Seoul Incheon
  ZSPD: { lat: 31.1434, lng: 121.8052 }, // Shanghai Pudong
  ZBAA: { lat: 40.0801, lng: 116.5846 }, // Beijing Capital
  VHHH: { lat: 22.3080, lng: 113.9185 }, // Hong Kong
  WSSS: { lat: 1.3644, lng: 103.9915 }, // Singapore
  WMKK: { lat: 2.7456, lng: 101.7099 }, // Kuala Lumpur
  VTBS: { lat: 13.6811, lng: 100.7473 }, // Bangkok Suvarnabhumi
  WMKP: { lat: 6.1667, lng: 100.4014 }, // Penang
  WMKJ: { lat: 1.6413, lng: 103.6699 }, // Johor Bahru
  WMKH: { lat: 6.1894, lng: 100.3981 }, // Alor Setar
  WMKU: { lat: 6.3297, lng: 99.7286 }, // Langkawi
  // Middle East
  OMDB: { lat: 25.2532, lng: 55.3657 }, // Dubai
  OJAI: { lat: 24.4330, lng: 54.6511 }, // Abu Dhabi
  OEDF: { lat: 24.9533, lng: 46.7253 }, // Riyadh
  OBBI: { lat: 26.2708, lng: 50.6336 }, // Bahrain
  OKBK: { lat: 29.2267, lng: 47.9689 }, // Kuwait
  OTHH: { lat: 25.2731, lng: 51.6081 }, // Doha
  // Africa
  FAOR: { lat: -26.1367, lng: 28.2411 }, // Johannesburg
  FACT: { lat: -33.9648, lng: 18.6017 }, // Cape Town
  HECA: { lat: 30.1127, lng: 31.4000 }, // Cairo
  // South America
  SBGR: { lat: -23.4321, lng: -46.4692 }, // São Paulo Guarulhos
  SBSP: { lat: -23.6267, lng: -46.6553 }, // São Paulo Congonhas
  SBRJ: { lat: -22.8089, lng: -43.2436 }, // Rio de Janeiro
  SBCF: { lat: -19.6244, lng: -43.9719 }, // Belo Horizonte
  SBBR: { lat: -15.8711, lng: -47.9186 }, // Brasília
  SBFL: { lat: -27.6702, lng: -48.5525 }, // Florianópolis
  SBFI: { lat: -25.6000, lng: -54.4833 }, // Foz do Iguaçu
  SBCG: { lat: -20.4686, lng: -54.6725 }, // Campo Grande
  SBPV: { lat: -8.1264, lng: -34.9236 }, // Recife
  SBSV: { lat: -12.9106, lng: -38.3311 }, // Salvador
  SBFN: { lat: -3.7763, lng: -38.5322 }, // Fortaleza
  SBEG: { lat: -3.0386, lng: -60.0497 }, // Manaus
  SBKP: { lat: -23.0075, lng: -47.1344 }, // Campinas
  SBPA: { lat: -30.0000, lng: -51.1767 }, // Porto Alegre
  SBCY: { lat: -15.6529, lng: -56.1167 }, // Cuiabá
  SBBE: { lat: -1.3792, lng: -48.4761 }, // Belém
  SBMQ: { lat: -0.0500, lng: -51.0722 }, // Macapá
  SBSL: { lat: -2.5850, lng: -44.2342 }, // São Luís
  SBTB: { lat: -2.8983, lng: -40.3361 }, // Teresina
  SBJP: { lat: -7.1458, lng: -34.9483 }, // João Pessoa
  SBNT: { lat: -5.9114, lng: -35.2478 }, // Natal
  SBMK: { lat: -5.7681, lng: -35.8961 }, // Maceió
  SBAX: { lat: -19.5631, lng: -46.9603 }, // Araxá
  SBUL: { lat: -18.8836, lng: -48.2256 }, // Uberlândia
  SBBH: { lat: -19.8519, lng: -43.9506 }, // Belo Horizonte Pampulha
  SBCR: { lat: -19.6244, lng: -43.9719 }, // Corumbá
  SBCZ: { lat: -7.6000, lng: -72.7667 }, // Cruzeiro do Sul
  SBTT: { lat: -4.2556, lng: -69.9358 }, // Tabatinga
  SBTF: { lat: -3.3828, lng: -64.7242 }, // Tefé
  SBPB: { lat: -2.8944, lng: -41.7319 }, // Parnaíba
  SBTE: { lat: -5.5319, lng: -42.8233 }, // Teresina
  // Australia
  YSSY: { lat: -33.9399, lng: 151.1753 }, // Sydney
  YMML: { lat: -37.6733, lng: 144.8433 }, // Melbourne
  YBBN: { lat: -27.3842, lng: 153.1175 }, // Brisbane
  YPPH: { lat: -31.9403, lng: 115.9669 }, // Perth
  YSCB: { lat: -35.3069, lng: 149.1925 }, // Canberra
  YPDN: { lat: -12.4083, lng: 130.8725 }, // Darwin
  YBAD: { lat: -34.9450, lng: 138.5306 }, // Adelaide
  YBCG: { lat: -28.1642, lng: 153.5047 }, // Gold Coast
  YBCS: { lat: -16.8858, lng: 145.7553 }, // Cairns
  YBRM: { lat: -20.7019, lng: 115.4011 }, // Broome
  YBTL: { lat: -19.2525, lng: 146.7653 }, // Townsville
  YBMA: { lat: -23.3819, lng: 150.4753 }, // Mackay
  YBRK: { lat: -23.3819, lng: 150.4753 }, // Rockhampton
  YBSU: { lat: -26.6033, lng: 153.0919 }, // Sunshine Coast
  YBHM: { lat: -20.3581, lng: 148.9517 }, // Hamilton Island
  // Canada
  CYYZ: { lat: 43.6772, lng: -79.6306 }, // Toronto Pearson
  CYVR: { lat: 49.1947, lng: -123.1792 }, // Vancouver
  CYUL: { lat: 45.4577, lng: -73.7497 }, // Montreal
  CYYC: { lat: 51.1139, lng: -114.0203 }, // Calgary
  CYEG: { lat: 53.3097, lng: -113.5797 }, // Edmonton
  CYOW: { lat: 45.3225, lng: -75.6692 }, // Ottawa
  CYHZ: { lat: 44.8808, lng: -63.5086 }, // Halifax
  CYQB: { lat: 46.7911, lng: -71.3933 }, // Quebec City
  CYQX: { lat: 48.9369, lng: -54.5681 }, // Gander
  // Mexico
  MMMX: { lat: 19.4363, lng: -99.0721 }, // Mexico City
  MMUN: { lat: 21.0365, lng: -86.8771 }, // Cancún
  MMGL: { lat: 20.5218, lng: -103.3112 }, // Guadalajara
  MMTJ: { lat: 32.5411, lng: -116.9700 }, // Tijuana
  MMVR: { lat: 19.1450, lng: -96.1875 }, // Veracruz
  MMMY: { lat: 25.7785, lng: -100.1069 }, // Monterrey
  MMZT: { lat: 23.1614, lng: -106.2661 }, // Mazatlán
  MMLP: { lat: 24.0725, lng: -110.3625 }, // La Paz
  MMML: { lat: 20.9375, lng: -89.6578 }, // Mérida
  MMCU: { lat: 28.7025, lng: -105.9644 }, // Chihuahua
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const upperCode = code.toUpperCase().trim();

  // Check if we have coordinates for this airport
  const coords = AIRPORT_COORDS[upperCode];

  if (coords) {
    return NextResponse.json(coords);
  }

  // If not found, return error
  return NextResponse.json(
    { error: "Airport not found" },
    { status: 404 }
  );
}
