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
  // Additional US Airports - Northeast
  KLGA: { lat: 40.7769, lng: -73.8740 }, // New York LaGuardia
  KBTV: { lat: 44.4728, lng: -73.1515 }, // Burlington International
  KHPN: { lat: 41.0670, lng: -73.7076 }, // White Plains
  KSWF: { lat: 41.5041, lng: -74.1048 }, // Newburgh
  KITH: { lat: 42.4910, lng: -76.4584 }, // Ithaca
  KBGM: { lat: 42.2087, lng: -75.9798 }, // Binghamton
  KELM: { lat: 42.1599, lng: -76.8916 }, // Elmira
  KERI: { lat: 42.0822, lng: -80.1762 }, // Erie
  KAVP: { lat: 41.3385, lng: -75.7234 }, // Scranton/Wilkes-Barre
  KABE: { lat: 40.6524, lng: -75.4408 }, // Allentown
  KMDT: { lat: 40.1935, lng: -76.7634 }, // Harrisburg
  KIPT: { lat: 41.2417, lng: -76.9211 }, // Williamsport
  KUNV: { lat: 40.8493, lng: -77.8487 }, // State College
  KAGC: { lat: 40.3544, lng: -79.9302 }, // Pittsburgh Allegheny County
  KCAK: { lat: 40.9161, lng: -81.4422 }, // Akron-Canton
  KCLE: { lat: 41.4117, lng: -81.8498 }, // Cleveland
  KCMH: { lat: 39.9980, lng: -82.8919 }, // Columbus
  KDAY: { lat: 39.9024, lng: -84.2194 }, // Dayton
  KCVG: { lat: 39.0488, lng: -84.6678 }, // Cincinnati
  KIND: { lat: 39.7173, lng: -86.2944 }, // Indianapolis
  KSDF: { lat: 38.1741, lng: -85.7365 }, // Louisville
  KLEX: { lat: 38.0365, lng: -84.6059 }, // Lexington
  KDCA: { lat: 38.8512, lng: -77.0402 }, // Washington Reagan
  KRIC: { lat: 37.5052, lng: -77.3197 }, // Richmond
  KORF: { lat: 36.8946, lng: -76.2012 }, // Norfolk
  KROA: { lat: 37.3255, lng: -79.9754 }, // Roanoke
  KCHO: { lat: 38.1386, lng: -78.4529 }, // Charlottesville
  // Southeast
  KSAV: { lat: 32.1276, lng: -81.2021 }, // Savannah
  KCHS: { lat: 32.8986, lng: -80.0405 }, // Charleston
  KMYR: { lat: 33.6797, lng: -78.9283 }, // Myrtle Beach
  KILM: { lat: 34.2706, lng: -77.9026 }, // Wilmington
  KFAY: { lat: 34.9912, lng: -78.8803 }, // Fayetteville
  KGSO: { lat: 36.0978, lng: -79.9373 }, // Greensboro
  KAVL: { lat: 35.4362, lng: -82.5418 }, // Asheville
  KTYS: { lat: 35.8110, lng: -83.9940 }, // Knoxville
  KCHA: { lat: 35.0353, lng: -85.2038 }, // Chattanooga
  KMEM: { lat: 35.0424, lng: -89.9767 }, // Memphis
  KBHM: { lat: 33.5629, lng: -86.7535 }, // Birmingham
  KMGM: { lat: 32.3006, lng: -86.3939 }, // Montgomery
  KMOB: { lat: 30.6912, lng: -88.2428 }, // Mobile
  KPNS: { lat: 30.4734, lng: -87.1866 }, // Pensacola
  KTLH: { lat: 30.3965, lng: -84.3503 }, // Tallahassee
  KJAX: { lat: 30.4941, lng: -81.6879 }, // Jacksonville
  KGNV: { lat: 29.6901, lng: -82.2718 }, // Gainesville
  KECP: { lat: 30.3573, lng: -85.7954 }, // Panama City
  KPFN: { lat: 30.2121, lng: -85.6828 }, // Panama City-Bay County
  KRSW: { lat: 26.5362, lng: -81.7552 }, // Fort Myers
  KPBI: { lat: 26.6832, lng: -80.0956 }, // West Palm Beach
  KSRQ: { lat: 27.3954, lng: -82.5544 }, // Sarasota
  KPIE: { lat: 27.9108, lng: -82.6874 }, // St. Petersburg
  // Midwest
  KDSM: { lat: 41.5340, lng: -93.6631 }, // Des Moines
  KCID: { lat: 41.8847, lng: -91.7108 }, // Cedar Rapids
  KMLI: { lat: 41.4485, lng: -90.5075 }, // Moline
  KMSN: { lat: 43.1399, lng: -89.3375 }, // Madison
  KGRB: { lat: 44.4851, lng: -88.1296 }, // Green Bay
  KATW: { lat: 44.2581, lng: -88.5191 }, // Appleton
  KEAU: { lat: 44.8658, lng: -91.4843 }, // Eau Claire
  KRST: { lat: 43.9083, lng: -92.5000 }, // Rochester MN
  KOMA: { lat: 41.3032, lng: -95.8941 }, // Omaha
  KLNK: { lat: 40.8510, lng: -96.7592 }, // Lincoln
  KICT: { lat: 37.6499, lng: -97.4331 }, // Wichita
  KTUL: { lat: 36.1984, lng: -95.8881 }, // Tulsa
  KOKC: { lat: 35.3931, lng: -97.6007 }, // Oklahoma City
  // Southwest
  KABQ: { lat: 35.0402, lng: -106.6092 }, // Albuquerque
  KELP: { lat: 31.8073, lng: -106.3776 }, // El Paso
  KMAF: { lat: 31.9425, lng: -102.2019 }, // Midland
  KAMA: { lat: 35.2194, lng: -101.7059 }, // Amarillo
  KLBB: { lat: 33.6636, lng: -101.8228 }, // Lubbock
  KCRP: { lat: 27.7704, lng: -97.5012 }, // Corpus Christi
  KBRO: { lat: 25.9068, lng: -97.4259 }, // Brownsville
  KHRL: { lat: 26.2285, lng: -97.6544 }, // Harlingen
  KLRD: { lat: 27.5438, lng: -99.4615 }, // Laredo
  KMFE: { lat: 26.1758, lng: -98.2386 }, // McAllen
  // West Coast & Mountain
  KOGD: { lat: 41.1959, lng: -112.0131 }, // Ogden
  KPVU: { lat: 40.2193, lng: -111.7233 }, // Provo
  KCDC: { lat: 37.7010, lng: -113.0989 }, // Cedar City
  KSGU: { lat: 37.0364, lng: -113.5103 }, // St. George
  KIDA: { lat: 43.5146, lng: -112.0708 }, // Idaho Falls
  KPIH: { lat: 42.9098, lng: -112.5961 }, // Pocatello
  KCOU: { lat: 38.8181, lng: -92.2196 }, // Columbia MO
  KSGF: { lat: 37.2457, lng: -93.3886 }, // Springfield MO
  KJLN: { lat: 37.1518, lng: -94.4983 }, // Joplin
  KFSD: { lat: 43.5820, lng: -96.7419 }, // Sioux Falls
  KRAP: { lat: 43.8773, lng: -103.0577 }, // Rapid City
  KABR: { lat: 45.4491, lng: -98.4218 }, // Aberdeen
  // California
  KLGB: { lat: 33.8177, lng: -118.1516 }, // Long Beach
  KVNY: { lat: 34.2098, lng: -118.4900 }, // Van Nuys
  KOXR: { lat: 34.2008, lng: -119.2072 }, // Oxnard
  KSCK: { lat: 37.8942, lng: -121.2383 }, // Stockton
  KVIS: { lat: 36.3187, lng: -119.3929 }, // Visalia
  KMOD: { lat: 37.6258, lng: -120.9544 }, // Modesto
  // Pacific Northwest
  KEUG: { lat: 44.1246, lng: -123.2119 }, // Eugene
  KRDM: { lat: 44.2541, lng: -121.1500 }, // Redmond
  KBFI: { lat: 47.5300, lng: -122.3020 }, // Seattle Boeing Field
  KPAE: { lat: 47.9063, lng: -122.2816 }, // Everett
  // Alaska
  PANC: { lat: 61.1744, lng: -149.9964 }, // Anchorage
  PAFA: { lat: 64.8151, lng: -147.8560 }, // Fairbanks
  PAJN: { lat: 58.3544, lng: -134.5761 }, // Juneau
  PASI: { lat: 57.0471, lng: -135.3616 }, // Sitka
  PAKT: { lat: 55.3556, lng: -131.7137 }, // Ketchikan
  // Hawaii
  PHNL: { lat: 21.3206, lng: -157.9242 }, // Honolulu
  PHOG: { lat: 20.8986, lng: -156.4306 }, // Kahului
  PHKO: { lat: 19.7388, lng: -156.0456 }, // Kona
  PHLI: { lat: 21.9759, lng: -159.3389 }, // Lihue
  // Puerto Rico & US Territories
  TJSJ: { lat: 18.4394, lng: -66.0018 }, // San Juan
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
