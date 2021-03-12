
const particlesSizeList = [
    {id:1,key:"Below 1µm",value:"Below 1µm"}, {id:2,key:"1-3 µm",value:"1-3 µm"}, {id:3,key:"2µm+",value:"2µm+"}
];

const cellTypeList = [
    {id:1,key:1,value:"Single cells"}, {id:2,key:2,value:"Heterogenous population"}
];

const fluorophoresData = [
{key:1640,value:"10-Acetyl-37-dihydroxyphenoxazin"},
{key:702,value:"2-NBDG"},
{key:1735,value:"4-MUP"},
{key:1036,value:"5-CFDA"},
{key:1738,value:"5-FAM"},
{key:1808,value:"5-TAMRA"},
{key:1809,value:"6-TAMRA"},
{key:1,value:"7-AAD"},
{key:1772,value:"7-Amino-4-methylcoumarin (AMC)"},
{key:151,value:"7C"},
{key:1704,value:"AccuClear"},
{key:1705,value:"AccuOrange"},
{key:1593,value:"Acridine Orange"},
{key:600,value:"Agarose"},
{key:1489,value:"alamarBlue"},
{key:621,value:"Aldefluor"},
{key:1102,value:"Alexa 488 NanoGold"},
{key:1104,value:"Alexa 546 NanoGold"},
{key:1103,value:"Alexa 594 NanoGold"},
{key:1105,value:"Alexa 647 NanoGold"},
{key:417,value:"Alexa Fluor 350"},
{key:3,value:"Alexa Fluor 405"},
{key:4,value:"Alexa Fluor 430"},
{key:5,value:"Alexa Fluor 488"},
{key:1172,value:"Alexa Fluor 488 NanoGold"},
{key:418,value:"Alexa Fluor 514"},
{key:6,value:"Alexa Fluor 532"},
{key:131,value:"Alexa Fluor 546"},
{key:161,value:"Alexa Fluor 555"},
{key:7,value:"Alexa Fluor 568"},
{key:419,value:"Alexa Fluor 594"},
{key:420,value:"Alexa Fluor 610"},
{key:8,value:"Alexa Fluor 633"},
{key:421,value:"Alexa Fluor 635"},
{key:9,value:"Alexa Fluor 647"},
{key:422,value:"Alexa Fluor 660"},
{key:132,value:"Alexa Fluor 680"},
{key:10,value:"Alexa Fluor 700"},
{key:11,value:"Alexa Fluor 750"},
{key:423,value:"Alexa Fluor 790"},
{key:1542,value:"Alizarin Red"},
{key:410,value:"Alk Phosphatase"},
{key:156,value:"AMCA"},
{key:12,value:"AmCyan"},
{key:979,value:"AmCyan - Protein"},
{key:1620,value:"Amethyst Orange"},
{key:13,value:"APC"},
{key:171,value:"APC-Alexa 680"},
{key:502,value:"APC-Alexa 700"},
{key:15,value:"APC-Alexa 750"},
{key:565,value:"APC-CF750"},
{key:1726,value:"APC-CF750T"},
{key:566,value:"APC-CF770"},
{key:14,value:"APC-Cy5.5"},
{key:16,value:"APC-Cy7"},
{key:133,value:"APC-eFluor 780"},
{key:943,value:"APC-Fire 750"},
{key:1587,value:"APC-Fire 810"},
{key:17,value:"APC-H7"},
{key:584,value:"APC-R700"},
{key:441,value:"APC-Vio770"},
{key:1771,value:"APF"},
{key:1800,value:"APTS"},
{key:1416,value:"ATTO 390"},
{key:1150,value:"ATTO 425"},
{key:1151,value:"ATTO 425 Phalloidin"},
{key:1454,value:"ATTO 465"},
{key:66,value:"ATTO 488"},
{key:1157,value:"ATTO 532"},
{key:1156,value:"ATTO 532 Phalloidin"},
{key:1553,value:"ATTO 542"},
{key:673,value:"ATTO 550"},
{key:1419,value:"ATTO 565"},
{key:577,value:"ATTO 594"},
{key:67,value:"ATTO 610"},
{key:1418,value:"ATTO 633"},
{key:1515,value:"ATTO 647"},
{key:1282,value:"ATTO 647N"},
{key:1158,value:"ATTO 655"},
{key:1159,value:"ATTO 655 Phalloidin"},
{key:1490,value:"ATTO 665"},
{key:1420,value:"ATTO 680"},
{key:1417,value:"ATTO 700"},
{key:1498,value:"ATTO RHO101"},
{key:1491,value:"ATTO Rho11"},
{key:1493,value:"ATTO Rho12"},
{key:1494,value:"ATTO Rho13"},
{key:1495,value:"ATTO Rho14"},
{key:1496,value:"ATTO Rho3B"},
{key:1497,value:"ATTO Rho6G"},
{key:1692,value:"BactoView Live Green"},
{key:1691,value:"BactoView Live Red"},
{key:448,value:"BB515"},
{key:1197,value:"BB700"},
{key:1768,value:"BCECF"},
{key:475,value:"BCECF (525em) pH9.0"},
{key:1769,value:"BCECF AM"},
{key:477,value:"BCECF (Red em) pH5.2"},
{key:1460,value:"BDY 630-X SE"},
{key:1461,value:"BDY 650-X SE"},
{key:1462,value:"BDY FL SE"},
{key:1463,value:"BDY FL-X SE"},
{key:1465,value:"BDY TMR-X SE"},
{key:1466,value:"BDY TR-X SE"},
{key:579,value:"Beta Gal"},
{key:84,value:"BFP"},
{key:726,value:"BIMA"},
{key:18,value:"Biotin"},
{key:1591,value:"BOBO-1"},
{key:1592,value:"BOBO-3"},
{key:1736,value:"BODIPY 493/503"},
{key:1598,value:"BODIPY 500/510"},
{key:1737,value:"BODIPY 558/568"},
{key:1597,value:"BODIPY 581/591"},
{key:1594,value:"BODIPY 630/650"},
{key:1596,value:"BODIPY 650/665"},
{key:692,value:"BODIPY FL"},
{key:1595,value:"BODIPY R6G"},
{key:1464,value:"BODIPY TMR-X"},
{key:703,value:"BODIPY TR"},
{key:1579,value:"BPE"},
{key:109,value:"Brilliant Violet 421"},
{key:851,value:"Brilliant Violet 480"},
{key:110,value:"Brilliant Violet 510"},
{key:111,value:"Brilliant Violet 570"},
{key:112,value:"Brilliant Violet 605"},
{key:113,value:"Brilliant Violet 650"},
{key:114,value:"Brilliant Violet 711"},
{key:1162,value:"Brilliant Violet 750"},
{key:115,value:"Brilliant Violet 785"},
{key:450,value:"Brilliant Violet 786"},
{key:169,value:"BUV395"},
{key:451,value:"BUV496"},
{key:827,value:"BUV563"},
{key:1864,value:"BUV615"},
{key:820,value:"BUV661"},
{key:193,value:"BUV737"},
{key:586,value:"BUV805"},
{key:1767,value:"Calcein"},
{key:388,value:"Calcein AM"},
{key:1766,value:"Calcein Blue"},
{key:389,value:"Calcein Blue AM"},
{key:1761,value:"Calcein Deep Red"},
{key:1760,value:"Calcein Deep Red AM"},
{key:1543,value:"Calcein Green"},
{key:1765,value:"Calcein Orange"},
{key:1763,value:"Calcein Red"},
{key:1762,value:"Calcein Red AM"},
{key:1611,value:"Calcein Red-Orange AM"},
{key:390,value:"Calcein Violet AM"},
{key:1601,value:"Calcium Crimson (Ca2+bound)"},
{key:736,value:"Calcium Green"},
{key:1610,value:"Calcium Orange"},
{key:1801,value:"California Red"},
{key:1284,value:"Carboxyfluorescein"},
{key:19,value:"Cascade Blue"},
{key:20,value:"Cascade Yellow"},
{key:1645,value:"CellBrite Blue"},
{key:1641,value:"CellBrite Fix 488"},
{key:1642,value:"CellBrite Fix 555"},
{key:1643,value:"CellBrite Fix 640"},
{key:1646,value:"CellBrite Green"},
{key:1648,value:"CellBrite NIR680"},
{key:1649,value:"CellBrite NIR750"},
{key:1651,value:"CellBrite NIR770"},
{key:1653,value:"CellBrite NIR790"},
{key:1654,value:"CellBrite Orange"},
{key:1655,value:"CellBrite Red"},
{key:1865,value:"CellBrite Steady 405"},
{key:1867,value:"CellBrite Steady 488"},
{key:1868,value:"CellBrite Steady 550"},
{key:1866,value:"CellBrite Steady 650"},
{key:1869,value:"CellBrite Steady 685"},
{key:1616,value:"CellMask Deep Red Plasma Membrane Stain"},
{key:1615,value:"CellMask Orange Plasma Membrane Stain"},
{key:704,value:"CellROX Deep Red"},
{key:970,value:"CellROX Green"},
{key:1037,value:"CellROX Orange"},
{key:1415,value:"CellTrace Blue"},
{key:1413,value:"CellTrace CFSE"},
{key:1414,value:"CellTrace Far Red"},
{key:1613,value:"CellTrace Oregon Green"},
{key:610,value:"CellTrace Violet"},
{key:1412,value:"CellTrace Yellow"},
{key:557,value:"CellTracker Blue"},
{key:1582,value:"CellTracker Deep Red"},
{key:602,value:"CellTracker Orange"},
{key:691,value:"CellTracker Red"},
{key:568,value:"CellTracker Violet"},
{key:685,value:"CellVue Burgundy"},
{key:679,value:"CellVue Jade"},
{key:686,value:"CellVue Lavender"},
{key:684,value:"CellVue Maroon"},
{key:683,value:"CellVue NIR780"},
{key:682,value:"CellVue Plum"},
{key:467,value:"Cerulean"},
{key:1200,value:"CF350"},
{key:1203,value:"CF405L"},
{key:821,value:"CF405M"},
{key:1201,value:"CF405S"},
{key:1727,value:"CF408"},
{key:1204,value:"CF430"},
{key:1205,value:"CF440"},
{key:1206,value:"CF450"},
{key:1207,value:"CF488A"},
{key:1585,value:"CF5"},
{key:1693,value:"CF500"},
{key:1694,value:"CF503R"},
{key:1208,value:"CF514"},
{key:1209,value:"CF517ST"},
{key:1210,value:"CF532"},
{key:1211,value:"CF535ST"},
{key:1695,value:"CF540"},
{key:1212,value:"CF543"},
{key:1696,value:"CF550R"},
{key:1213,value:"CF555"},
{key:1214,value:"CF568"},
{key:1252,value:"CF568ST"},
{key:1215,value:"CF570"},
{key:1217,value:"CF583"},
{key:1708,value:"CF583R"},
{key:1216,value:"CF594"},
{key:1218,value:"CF594ST"},
{key:1219,value:"CF620R"},
{key:1220,value:"CF633"},
{key:1221,value:"CF640R"},
{key:1222,value:"CF647"},
{key:1253,value:"CF647ST"},
{key:1728,value:"CF650"},
{key:1223,value:"CF660C"},
{key:1224,value:"CF660R"},
{key:1254,value:"CF660ST"},
{key:1225,value:"CF680"},
{key:1226,value:"CF680R"},
{key:1255,value:"CF680ST"},
{key:1697,value:"CF680T"},
{key:1698,value:"CF700"},
{key:607,value:"CF750"},
{key:1256,value:"CF750ST"},
{key:1227,value:"CF770"},
{key:1699,value:"CF770T"},
{key:1228,value:"CF790"},
{key:1229,value:"CF800"},
{key:1700,value:"CF820"},
{key:85,value:"CFP"},
{key:92,value:"CFSE"},
{key:1552,value:"Chromeo 488"},
{key:1563,value:"Chromeo 494"},
{key:1564,value:"Chromeo 505"},
{key:1565,value:"Chromeo 546"},
{key:1566,value:"Chromeo 642"},
{key:655,value:"CMA-Chromomycin A3"},
{key:1544,value:"CoraLite 488"},
{key:1545,value:"CoraLite 594"},
{key:1546,value:"CoraLite 647"},
{key:1475,value:"CPN475 Blue"},
{key:1477,value:"CPN510 Green"},
{key:1476,value:"CPN550 Yellow"},
{key:1474,value:"CPN680 Red"},
{key:69,value:"Cy2"},
{key:21,value:"Cy3"},
{key:70,value:"Cy3.5"},
{key:22,value:"Cy5"},
{key:72,value:"Cy5.5"},
{key:157,value:"Cy7"},
{key:1467,value:"Cyanine 3 SE"},
{key:1690,value:"Cyanine 555"},
{key:1468,value:"Cyanine 5 SE"},
{key:1689,value:"Cyanine 647"},
{key:1469,value:"Cyanine 7 SE"},
{key:1556,value:"CypHer5E"},
{key:1741,value:"CytoCalcein Violet 450"},
{key:1742,value:"CytoCalcein Violet 500"},
{key:834,value:"CYTO-ID Green"},
{key:826,value:"CYTO-ID Green Cell Trace"},
{key:825,value:"CYTO-ID Red Cell Trace"},
{key:1803,value:"CytoTrace Green CMFDA"},
{key:1802,value:"CytoTrace Red"},
{key:1131,value:"CytoTrack Blue"},
{key:1135,value:"CytoTrack Green"},
{key:1139,value:"CytoTrack Red"},
{key:1136,value:"CytoTrack Yellow"},
{key:690,value:"CyTRAK Orange"},
{key:1758,value:"DAF-FM"},
{key:1755,value:"Dansyl"},
{key:23,value:"DAPI"},
{key:483,value:"DCF"},
{key:1759,value:"Di-8-ANEPPS"},
{key:701,value:"DiD"},
{key:1609,value:"DiFMU pH3.0"},
{key:1608,value:"DiFMU pH9.0"},
{key:1764,value:"Dihydroethidium"},
{key:461,value:"DiI"},
{key:1757,value:"DiIC1(5)"},
{key:463,value:"DiO"},
{key:1686,value:"DiR"},
{key:1685,value:"DMAO"},
{key:24,value:"DRAQ 5"},
{key:708,value:"DRAQ 7"},
{key:1547,value:"DRAQ 9"},
{key:87,value:"dsRed"},
{key:1057,value:"DsRed2"},
{key:491,value:"DsRed Express"},
{key:537,value:"dTomato"},
{key:1072,value:"DY-350XL"},
{key:1087,value:"DY-350XL Phalloidin"},
{key:1073,value:"DY-360XL"},
{key:1088,value:"DY-360XL Phalloidin"},
{key:1096,value:"DY-370XL"},
{key:1089,value:"DY-370XL Phalloidin"},
{key:1074,value:"DY-375XL"},
{key:1090,value:"DY-375XL Phalloidin"},
{key:1076,value:"DY-380XL"},
{key:1091,value:"DY-380XL Phalloidin"},
{key:1092,value:"DY-395XL"},
{key:1093,value:"DY-395XL Phalloidin"},
{key:1154,value:"DY-415"},
{key:1155,value:"DY-415 Phalloidin"},
{key:1077,value:"DY-480XL"},
{key:1081,value:"DY-481XL"},
{key:1078,value:"DY-485XL"},
{key:1079,value:"DY-510XL"},
{key:1097,value:"DY-511XL"},
{key:1098,value:"DY-520XL"},
{key:1099,value:"DY-521XL"},
{key:1119,value:"DY-547 Phalloidin"},
{key:1080,value:"DY-601XL"},
{key:55,value:"DyLight 350"},
{key:56,value:"DyLight 405"},
{key:153,value:"DyLight 405LS"},
{key:57,value:"DyLight 488"},
{key:58,value:"DyLight 549"},
{key:126,value:"DyLight 550"},
{key:59,value:"DyLight 594"},
{key:60,value:"DyLight 633"},
{key:61,value:"DyLight 649"},
{key:127,value:"DyLight 650"},
{key:62,value:"DyLight 680"},
{key:63,value:"DyLight 750"},
{key:152,value:"DyLight 755"},
{key:64,value:"DyLight 800"},
{key:73,value:"Dyomics 547"},
{key:81,value:"Dyomics 590"},
{key:74,value:"Dyomics 647"},
{key:1039,value:"E2-Crimson"},
{key:497,value:"eBFP"},
{key:86,value:"ECD"},
{key:495,value:"eCFP"},
{key:185,value:"eFluor 450"},
{key:688,value:"eFluor 450 Cell Proliferation"},
{key:392,value:"eFluor 450 Fix Viability"},
{key:391,value:"eFluor 455UV Fix Viability"},
{key:1193,value:"eFluor 506"},
{key:393,value:"eFluor 506 Fix Viability"},
{key:689,value:"eFluor 514 Calcium Sensor"},
{key:394,value:"eFluor 520 Fix Viability"},
{key:188,value:"eFluor 565NC"},
{key:187,value:"eFluor 570"},
{key:184,value:"eFluor 585NC"},
{key:180,value:"eFluor 605NC"},
{key:181,value:"eFluor 615"},
{key:182,value:"eFluor 625NC"},
{key:179,value:"eFluor 650NC"},
{key:183,value:"eFluor 660"},
{key:395,value:"eFluor 660 Fix Viability"},
{key:687,value:"eFluor 670 Cell Proliferation"},
{key:677,value:"eFluor 710"},
{key:396,value:"eFluor 780 Fix Viability"},
{key:993,value:"EFLUXX-ID Gold"},
{key:992,value:"EFLUXX-ID Green"},
{key:499,value:"eGFP"},
{key:676,value:"EMA"},
{key:657,value:"Emerald GFP"},
{key:982,value:"ENZO Gold"},
{key:989,value:"ER-ID Green"},
{key:990,value:"ER-ID Red"},
{key:25,value:"Ethidium B."},
{key:1702,value:"Ethidium Homodimer I"},
{key:1703,value:"Ethidium Homodimer III"},
{key:1706,value:"EvaGreen"},
{key:1707,value:"EvaGreen Plus"},
{key:455,value:"eVolve 605"},
{key:457,value:"eVolve 655"},
{key:971,value:"eYFP"},
{key:1804,value:"FAM"},
{key:1127,value:"FDG"},
{key:26,value:"FITC"},
{key:1754,value:"FlAsH"},
{key:1176,value:"Flash Phalloidin Green 488"},
{key:1049,value:"Flash Phalloidin NIR 647"},
{key:1048,value:"Flash Phalloidin Red 594"},
{key:1683,value:"Fluo-3"},
{key:653,value:"Fluo-3 AM"},
{key:1684,value:"Fluo-4"},
{key:665,value:"Fluo-4 AM"},
{key:987,value:"FLUOFORTE"},
{key:1425,value:"FluoProbes647H"},
{key:146,value:"Fluorescein"},
{key:1101,value:"Fluorescein-NanoGold"},
{key:967,value:"Fluoro-Gold"},
{key:706,value:"Fura-2 (Ca2+bound)"},
{key:797,value:"Fura-2 (Ca2+free)"},
{key:667,value:"Fura Red AM (Ca2+bound)"},
{key:666,value:"Fura Red AM (Ca2+free)"},
{key:1522,value:"FVS440UV"},
{key:547,value:"FVS450"},
{key:405,value:"FVS510"},
{key:406,value:"FVS520"},
{key:623,value:"FVS570"},
{key:1041,value:"FVS575V"},
{key:625,value:"FVS620"},
{key:407,value:"FVS660"},
{key:627,value:"FVS700"},
{key:720,value:"FVS780"},
{key:661,value:"FxCycle Far Red"},
{key:656,value:"FxCycle Violet"},
{key:1688,value:"GelGreen"},
{key:1687,value:"GelRed"},
{key:82,value:"GFP"},
{key:1521,value:"Ghost Dye Blue 516"},
{key:731,value:"Ghost Dye Red 710"},
{key:730,value:"Ghost Dye Red 780"},
{key:732,value:"Ghost Dye UV 450"},
{key:729,value:"Ghost Dye Violet 450"},
{key:733,value:"Ghost Dye Violet 510"},
{key:1446,value:"Ghost Dye Violet 540"},
{key:991,value:"GOLGI-ID Green"},
{key:433,value:"Hc Red"},
{key:1053,value:"Helix NP NIR"},
{key:1518,value:"HiLyte 405"},
{key:68,value:"HiLyte 488"},
{key:1516,value:"HiLyte 555"},
{key:1517,value:"HiLyte 594"},
{key:1442,value:"HiLyte 647"},
{key:1519,value:"HiLyte 750"},
{key:94,value:"Hoechst (33258)"},
{key:93,value:"Hoechst (33342)"},
{key:1042,value:"Hoechst (34580)"},
{key:189,value:"HRP"},
{key:1756,value:"Hydroxystilbamidine"},
{key:1619,value:"iFluor 350"},
{key:1794,value:"iFluor 405"},
{key:1386,value:"iFluor 488"},
{key:1795,value:"iFluor 514"},
{key:1796,value:"iFluor 532"},
{key:1409,value:"iFluor 555"},
{key:1797,value:"iFluor 594"},
{key:1798,value:"iFluor 633"},
{key:1387,value:"iFluor 647"},
{key:1389,value:"iFluor 680"},
{key:1799,value:"iFluor 700"},
{key:1805,value:"iFluor 750"},
{key:1388,value:"iFluor 790"},
{key:696,value:"IFP 1.4"},
{key:1806,value:"Indocyanine Green"},
{key:95,value:"Indo-Hi (Ca2+bound)"},
{key:705,value:"Indo-Lo (Ca2+free)"},
{key:1557,value:"IRDye 650"},
{key:1558,value:"IRDye 680LT"},
{key:1559,value:"IRDye 680RD"},
{key:1396,value:"IRDye 800CW"},
{key:816,value:"iRFP"},
{key:1391,value:"iRFP 670"},
{key:1392,value:"iRFP 682"},
{key:1393,value:"iRFP 702"},
{key:1394,value:"iRFP 713"},
{key:1390,value:"iRFP 720"},
{key:1433,value:"Janelia Fluor 525"},
{key:1299,value:"Janelia Fluor 549"},
{key:1381,value:"Janelia Fluor 585"},
{key:1382,value:"Janelia Fluor 635"},
{key:1298,value:"Janelia Fluor 646"},
{key:1383,value:"Janelia Fluor 669"},
{key:570,value:"JC-1"},
{key:1152,value:"Kaede (green)"},
{key:1153,value:"Kaede (red)"},
{key:928,value:"Katushka2S"},
{key:1148,value:"KikGR1 (green)"},
{key:1149,value:"KikGR1 (red)"},
{key:1562,value:"KIRAVIA Blue 520"},
{key:88,value:"Krome Orange"},
{key:819,value:"LDS 751"},
{key:1659,value:"LipidSpot 488"},
{key:1660,value:"LipidSpot 610"},
{key:316,value:"Live/Dead Fix Aqua"},
{key:386,value:"Live/Dead Fix Blue"},
{key:320,value:"Live/Dead Fix Far Red"},
{key:318,value:"Live/Dead Fix Green"},
{key:321,value:"Live/Dead Fix Near IR"},
{key:319,value:"Live/Dead Fix Red"},
{key:315,value:"Live/Dead Fix Violet"},
{key:317,value:"Live/Dead Fix Yellow"},
{key:1242,value:"Live-or-Dye 350/448"},
{key:1709,value:"Live-or-Dye 375/600"},
{key:1243,value:"Live-or-Dye 405/452"},
{key:1249,value:"Live-or-Dye 405/545"},
{key:1244,value:"Live-or-Dye 488/515"},
{key:1656,value:"Live-or-Dye 510/550"},
{key:1245,value:"Live-or-Dye 568/583"},
{key:1246,value:"Live-or-Dye 594/614"},
{key:1710,value:"Live-or-Dye 615/740"},
{key:1247,value:"Live-or-Dye 640/662"},
{key:1657,value:"Live-or-Dye 665/685"},
{key:1248,value:"Live-or-Dye 750/777"},
{key:1658,value:"Live-or-Dye 787/808"},
{key:1250,value:"Live-or-Dye NucFix Red"},
{key:852,value:"LSS-mKate1"},
{key:853,value:"LSS-mKate2"},
{key:1874,value:"LSSmOrange"},
{key:611,value:"Lucifer Yellow"},
{key:1739,value:"Lucigenin"},
{key:1740,value:"Luminol"},
{key:1743,value:"LysoBrite Blue"},
{key:1744,value:"LysoBrite Deep Red"},
{key:1745,value:"LysoBrite Green"},
{key:1746,value:"LysoBrite NIR"},
{key:1747,value:"LysoBrite Orange"},
{key:1748,value:"LysoBrite Red"},
{key:994,value:"LYSO-ID Green"},
{key:1617,value:"LysoSensor Yellow/Blue pH3.0"},
{key:1618,value:"LysoSensor Yellow/Blue pH9.0"},
{key:641,value:"LysoTracker Green"},
{key:1675,value:"LysoView 405"},
{key:1676,value:"LysoView 488"},
{key:1236,value:"LysoView 540"},
{key:1237,value:"LysoView 633"},
{key:1677,value:"LysoView 650"},
{key:1614,value:"Mag-Fura-2"},
{key:1143,value:"Magic Red"},
{key:1059,value:"Malachite Green"},
{key:1160,value:"Malachite Green 2p"},
{key:802,value:"mAmetrine"},
{key:663,value:"mApple"},
{key:136,value:"Marina Blue"},
{key:1507,value:"MaxLight 405"},
{key:1508,value:"MaxLight 490"},
{key:1509,value:"MaxLight 550"},
{key:1510,value:"MaxLight 650"},
{key:1511,value:"MaxLight 750"},
{key:91,value:"mBanana"},
{key:801,value:"mBBR"},
{key:695,value:"mBCl"},
{key:1875,value:"mCerulean3"},
{key:89,value:"mCherry"},
{key:668,value:"mCitrine"},
{key:1661,value:"MemBrite Fix 405/430"},
{key:1663,value:"MemBrite Fix 488/515"},
{key:1665,value:"MemBrite Fix 543/560"},
{key:1666,value:"MemBrite Fix 568/580"},
{key:1667,value:"MemBrite Fix 594/615"},
{key:1668,value:"MemBrite Fix 640/660"},
{key:1669,value:"MemBrite Fix 660/680"},
{key:1670,value:"MemBrite Fix 680/700"},
{key:1671,value:"MemBrite Fix ST 650/665"},
{key:1672,value:"MemBrite Fix ST 667/685"},
{key:1673,value:"MemBrite Fix ST 681/698"},
{key:1674,value:"MemBrite Fix ST 755/777"},
{key:1384,value:"mFluor 450"},
{key:1385,value:"mFluor 540"},
{key:930,value:"mHoneyDew"},
{key:929,value:"MiCy1"},
{key:996,value:"MITO-ID (Extracellular O2)"},
{key:988,value:"MITO-ID Green"},
{key:986,value:"MITO-ID MP (high potential)"},
{key:983,value:"MITO-ID Red"},
{key:1752,value:"MitoLite Blue FX490"},
{key:1753,value:"MitoLite Deep Red FX660"},
{key:1773,value:"MitoLite Green EX488"},
{key:1774,value:"MitoLite Green FM"},
{key:1775,value:"MitoLite NIR FX690"},
{key:1776,value:"MitoLite Orange EX405"},
{key:1777,value:"MitoLite Orange FX570"},
{key:1778,value:"MitoLite Red FX600"},
{key:1470,value:"MitoMark Green"},
{key:1471,value:"MitoMark Red"},
{key:1781,value:"MitoROS 520"},
{key:700,value:"MitoSOX Red"},
{key:1058,value:"MitoSpy Green"},
{key:1440,value:"MitoSpy NIR"},
{key:933,value:"MitoSpy Orange"},
{key:1177,value:"MitoSpy Red"},
{key:487,value:"MitoTracker CMXRos Red"},
{key:471,value:"MitoTracker Deep Red"},
{key:639,value:"MitoTracker Green"},
{key:694,value:"MitoTracker Orange"},
{key:473,value:"MitoTracker Red"},
{key:1678,value:"MitoView 405"},
{key:1235,value:"MitoView 633"},
{key:1679,value:"MitoView 650"},
{key:1680,value:"MitoView 720"},
{key:1234,value:"MitoView Blue"},
{key:1233,value:"MitoView Green"},
{key:1850,value:"mKate"},
{key:90,value:"mKate2"},
{key:838,value:"mKeima"},
{key:932,value:"mKO"},
{key:1371,value:"mKusabira-Orange2"},
{key:1569,value:"mNeptune"},
{key:1779,value:"Monobromobimane"},
{key:574,value:"mOrange"},
{key:431,value:"mPlum"},
{key:660,value:"mRaspberry"},
{key:603,value:"mRFP1"},
{key:604,value:"mRuby"},
{key:575,value:"mStrawberry"},
{key:658,value:"mTangerine"},
{key:839,value:"mTurquoise"},
{key:1500,value:"NADH"},
{key:1635,value:"NBD"},
{key:1751,value:"NBD-X"},
{key:1636,value:"Neuro DiO"},
{key:1122,value:"NeuroVue Burgundy"},
{key:1123,value:"NeuroVue Jade"},
{key:1124,value:"NeuroVue Maroon"},
{key:1125,value:"NeuroVue Orange"},
{key:1126,value:"NeuroVue Red"},
{key:952,value:"Newport Green DCF"},
{key:811,value:"Nile Blue"},
{key:485,value:"Nile Red"},
{key:1395,value:"NirFP"},
{key:173,value:"NL 493"},
{key:175,value:"NL 557"},
{key:177,value:"NL 637"},
{key:1711,value:"NovaBlue 510"},
{key:1571,value:"NovaBlue 530"},
{key:1712,value:"NovaBlue 555"},
{key:1572,value:"NovaBlue 610 / 30S"},
{key:1730,value:"NovaBlue 610 / 70S"},
{key:1731,value:"NovaBlue 660 / 120S"},
{key:1573,value:"NovaBlue 660 / 40S"},
{key:1718,value:"NovaRed 660"},
{key:1719,value:"NovaRed 685"},
{key:1720,value:"NovaRed 700"},
{key:1574,value:"NovaYellow 570"},
{key:1575,value:"NovaYellow 610"},
{key:1576,value:"NovaYellow 660"},
{key:1723,value:"NovaYellow 690"},
{key:1724,value:"NovaYellow 700"},
{key:1780,value:"Nuclear Blue"},
{key:1782,value:"Nuclear Green"},
{key:835,value:"Nuclear-ID Blue"},
{key:831,value:"Nuclear-ID Green"},
{key:836,value:"Nuclear-ID Red"},
{key:1783,value:"Nuclear Orange"},
{key:1784,value:"Nuclear Red"},
{key:1785,value:"Nuclear Violet"},
{key:1786,value:"Nuclear Yellow"},
{key:984,value:"Nucleolar-ID Green"},
{key:1625,value:"NucSpot 470"},
{key:1626,value:"NucSpot Far-Red"},
{key:1627,value:"NucSpot Live 488"},
{key:1628,value:"NucSpot Live 650"},
{key:1230,value:"NucView 405"},
{key:1231,value:"NucView 488"},
{key:1232,value:"NucView 530"},
{key:551,value:"OC515"},
{key:538,value:"OFP"},
{key:425,value:"Oregon Green 488"},
{key:1612,value:"Oregon Green 488 BAPTA"},
{key:426,value:"Oregon Green 514"},
{key:1637,value:"Oxazole Blue"},
{key:1638,value:"Oxazole Yellow"},
{key:1548,value:"Oyster 488"},
{key:1549,value:"Oyster 550"},
{key:1550,value:"Oyster 650"},
{key:1551,value:"Oyster 680"},
{key:1580,value:"P3"},
{key:28,value:"Pacific Blue"},
{key:427,value:"Pacific Green"},
{key:29,value:"Pacific Orange"},
{key:30,value:"PE"},
{key:1481,value:"PE-594"},
{key:1581,value:"PE-665"},
{key:1482,value:"PE-695"},
{key:1807,value:"PE-777"},
{key:31,value:"PE-Alexa 610"},
{key:32,value:"PE-Alexa 647"},
{key:76,value:"PE-Alexa 700"},
{key:77,value:"PE-Alexa 750"},
{key:1421,value:"PE-ATTO 594"},
{key:165,value:"PE-CF594"},
{key:33,value:"PE-Cy5"},
{key:34,value:"PE-Cy5.5"},
{key:35,value:"PE-Cy7"},
{key:453,value:"PE-Dazzle 594"},
{key:824,value:"PE-DyLight 594"},
{key:80,value:"PE-Dyomics 590"},
{key:79,value:"PE-Dyomics 647"},
{key:593,value:"PE-eFluor 610"},
{key:1586,value:"PE-Fire 640"},
{key:1588,value:"PE-Fire 700"},
{key:1273,value:"PE-Fire 780"},
{key:37,value:"PerCP"},
{key:416,value:"PerCP-Cy5"},
{key:38,value:"PerCP-Cy5.5"},
{key:186,value:"PerCP-eFluor 710"},
{key:555,value:"PerCP-Vio700"},
{key:36,value:"PE-Texas Red"},
{key:935,value:"PE-Vio615"},
{key:439,value:"PE-Vio770"},
{key:1116,value:"Phalloidin-eFluor 520"},
{key:1117,value:"Phalloidin-eFluor 570"},
{key:1118,value:"Phalloidin-eFluor 660"},
{key:1457,value:"Phalloidin-TFAX 488"},
{key:1872,value:"PhenoVue 493 Lipid Stain"},
{key:1873,value:"PhenoVue 512 Nucleic Acid Stain"},
{key:1815,value:"PhenoVue 551 Mitochondrial Stain"},
{key:1816,value:"PhenoVue 578 Mitochondrial Stain"},
{key:1817,value:"PhenoVue 641 Mitochondrial Stain"},
{key:1810,value:"PhenoVue Fluor 488"},
{key:1811,value:"PhenoVue Fluor 555"},
{key:1812,value:"PhenoVue Fluor 568"},
{key:1813,value:"PhenoVue Fluor 594"},
{key:1814,value:"PhenoVue Hoechst 33342 Nuclear Stain"},
{key:1818,value:"PhenoVue Nile Red Lipid Stain"},
{key:1107,value:"pHrodo Green"},
{key:1106,value:"pHrodo Red"},
{key:39,value:"PI"},
{key:446,value:"PKH26"},
{key:646,value:"PKH67"},
{key:1681,value:"PMA"},
{key:1682,value:"PMAxx"},
{key:1589,value:"POPO-1"},
{key:1590,value:"POPO-3"},
{key:1599,value:"Premo Cameleon Calcium Sensor (Ca2+ bound)"},
{key:1600,value:"Premo Cameleon Calcium Sensor (Ca2+ free)"},
{key:1296,value:"PromoFluor 350"},
{key:1295,value:"PromoFluor 405"},
{key:1294,value:"PromoFluor 488P"},
{key:1293,value:"PromoFluor 555P"},
{key:1292,value:"PromoFluor 594"},
{key:1291,value:"PromoFluor 633P"},
{key:1290,value:"PromoFluor 647P"},
{key:1289,value:"PromoFluor 680"},
{key:1288,value:"PromoFluor 750"},
{key:1287,value:"PromoFluor 780"},
{key:1267,value:"PromoFluor 840"},
{key:995,value:"PROTEOSTAT-Red"},
{key:1054,value:"Protoporphyrin IX"},
{key:40,value:"Purified"},
{key:489,value:"Pyronin Y"},
{key:75,value:"Qdot 525"},
{key:130,value:"Qdot 545"},
{key:42,value:"Qdot 565"},
{key:43,value:"Qdot 585"},
{key:44,value:"Qdot 605"},
{key:135,value:"Qdot 625"},
{key:45,value:"Qdot 655"},
{key:46,value:"Qdot 705"},
{key:47,value:"Qdot 800"},
{key:554,value:"Quantum Red"},
{key:1397,value:"ReadiLink 405-454"},
{key:1398,value:"ReadiLink 405-508"},
{key:1399,value:"ReadiLink 405-537"},
{key:1400,value:"ReadiLink 492-516"},
{key:1401,value:"ReadiLink 555-570"},
{key:1402,value:"ReadiLink 594-610"},
{key:1403,value:"ReadiLink 633-655"},
{key:1404,value:"ReadiLink 647-674"},
{key:1405,value:"ReadiLink 680-701"},
{key:1406,value:"ReadiLink 700-713"},
{key:1407,value:"ReadiLink 750-780"},
{key:1408,value:"ReadiLink 790-811"},
{key:1750,value:"ReAsH"},
{key:1819,value:"Red 718"},
{key:1238,value:"RedDot 1"},
{key:1239,value:"RedDot 2"},
{key:662,value:"redFluor 710"},
{key:981,value:"Red Necrosis Stain"},
{key:721,value:"Resazurin"},
{key:1639,value:"Resorufin"},
{key:459,value:"RFP"},
{key:1602,value:"Rhod-2 (Ca2+ bound)"},
{key:1604,value:"Rhod-5N (Ca2+ bound)"},
{key:150,value:"Rhodamine"},
{key:1789,value:"Rhodamine 101"},
{key:633,value:"Rhodamine 110"},
{key:631,value:"Rhodamine 123"},
{key:1451,value:"Rhodamine 6G"},
{key:1450,value:"Rhodamine B"},
{key:1453,value:"Rhodamine Green"},
{key:1452,value:"Rhodamine-phalloidin"},
{key:71,value:"Rhodamine Red"},
{key:573,value:"Rhodamine Red-X"},
{key:1791,value:"Rhod-FF"},
{key:1792,value:"Rhod-FF AM"},
{key:1499,value:"Riboflavin"},
{key:795,value:"ROS"},
{key:1787,value:"Rose Bengal"},
{key:832,value:"ROS-ID Green"},
{key:833,value:"ROS-ID Orange"},
{key:980,value:"ROS-ID Red"},
{key:1584,value:"RPC"},
{key:1729,value:"RPE-CF583R"},
{key:1701,value:"RPE-CF647T"},
{key:672,value:"Saporin"},
{key:1793,value:"SBFI"},
{key:727,value:"Sepharose"},
{key:1524,value:"Seta-385-NHS"},
{key:1523,value:"Seta-400-NHS"},
{key:1525,value:"Seta-555-NHS"},
{key:1526,value:"Seta-650-NHS"},
{key:1527,value:"Seta-680-NHS"},
{key:1528,value:"Seta-750-NHS"},
{key:1534,value:"Seta-APC-705"},
{key:1535,value:"Seta-APC-780"},
{key:1538,value:"Seta-PerCP-680"},
{key:1536,value:"Seta-R-PE-670"},
{key:1537,value:"Seta-R-PE-775"},
{key:1530,value:"SeTau-647-di-NHS"},
{key:1531,value:"SeTau-647-NHS"},
{key:1529,value:"SeTau-665-NHS"},
{key:1532,value:"SeTau-670-NHS"},
{key:1533,value:"SeTau-680-NHS"},
{key:1607,value:"SNARF 1 pH6.0"},
{key:1606,value:"SNARF 1 pH9.0"},
{key:1503,value:"Spark Blue 550"},
{key:1504,value:"Spark NIR 685"},
{key:1871,value:"Spark Violet 538"},
{key:1570,value:"Spark YG 570"},
{key:724,value:"Spectral Red"},
{key:815,value:"Spectrum Aqua"},
{key:814,value:"Spectrum Green"},
{key:1790,value:"SPQ"},
{key:1163,value:"STAR 440SXP"},
{key:1164,value:"STAR 470SXP"},
{key:1165,value:"STAR 488"},
{key:1166,value:"STAR 512"},
{key:1167,value:"STAR 520SXP"},
{key:1168,value:"STAR 580"},
{key:1169,value:"STAR 600"},
{key:1170,value:"STAR 635"},
{key:1171,value:"STAR 635P"},
{key:1448,value:"StarBright Blue 520"},
{key:1300,value:"StarBright Blue 700"},
{key:1621,value:"StarBright Violet 440"},
{key:1901,value:"StarBright Violet 475"},
{key:1622,value:"StarBright Violet 515"},
{key:1902,value:"StarBright Violet 570"},
{key:1623,value:"StarBright Violet 610"},
{key:1624,value:"StarBright Violet 670"},
{key:1903,value:"StarBright Violet 710"},
{key:1911,value:"StarBright Violet 760"},
{key:1904,value:"StarBright Violet 790"},
{key:1568,value:"STAR GREEN"},
{key:1567,value:"STAR ORANGE"},
{key:1554,value:"STAR RED"},
{key:1749,value:"Sulforhodamine 101"},
{key:1182,value:"SuperBright 436"},
{key:1183,value:"SuperBright 600"},
{key:1258,value:"SuperBright 645"},
{key:1259,value:"SuperBright 702"},
{key:1368,value:"SuperBright 780"},
{key:1861,value:"SuperNova v428"},
{key:1862,value:"SuperNova v605"},
{key:1863,value:"SuperNova v786"},
{key:1480,value:"SureLight 488"},
{key:709,value:"SYBR Green"},
{key:1629,value:"Synapto Green"},
{key:1630,value:"Synapto Red"},
{key:1905,value:"Syto 16"},
{key:479,value:"Syto 61"},
{key:1035,value:"Syto 9"},
{key:605,value:"Sytox AADvanced"},
{key:536,value:"Sytox Blue"},
{key:1870,value:"Sytox Deep Red"},
{key:48,value:"Sytox Green"},
{key:659,value:"Sytox Orange"},
{key:539,value:"Sytox Red"},
{key:549,value:"TagBFP"},
{key:934,value:"Tag-It Violet"},
{key:1174,value:"TagRFP"},
{key:1047,value:"TagRFP657"},
{key:148,value:"tdTomato"},
{key:49,value:"Texas Red"},
{key:1502,value:"TFAX 488 SE"},
{key:1472,value:"TFAX 488 TFP"},
{key:1501,value:"TFAX 546 SE"},
{key:1458,value:"TFAX 568 SE"},
{key:1459,value:"TFAX 594 SE"},
{key:800,value:"TFP"},
{key:1423,value:"Thiazole Orange"},
{key:1631,value:"Thiazole Orange Homodimer"},
{key:1632,value:"Thiazole Orange Iodide"},
{key:1633,value:"Thiazole Red"},
{key:1634,value:"Thiazole Red Homodimer"},
{key:1770,value:"TMA-DPH"},
{key:1038,value:"TMRE"},
{key:931,value:"Topaz"},
{key:51,value:"TO-Pro 1"},
{key:52,value:"TO-Pro 3"},
{key:553,value:"TOTO-1"},
{key:629,value:"TOTO-3"},
{key:424,value:"Tri-Color"},
{key:65,value:"TRITC"},
{key:978,value:"T-Sapphire"},
{key:53,value:"V450"},
{key:54,value:"V500"},
{key:469,value:"Venus"},
{key:1240,value:"ViaFluor 405"},
{key:1335,value:"ViaFluor 488"},
{key:1241,value:"ViaFluor 568"},
{key:1251,value:"Viafluor CFSE"},
{key:1485,value:"ViaKrome 405"},
{key:1486,value:"ViaKrome 561"},
{key:1487,value:"ViaKrome 638"},
{key:1488,value:"ViaKrome 808"},
{key:941,value:"Vio488"},
{key:1051,value:"Vio515"},
{key:1199,value:"Vio667"},
{key:972,value:"Viobility 405/452 Fixable Dye"},
{key:973,value:"Viobility 405/520 Fixable Dye"},
{key:974,value:"Viobility 488/520 Fixable Dye"},
{key:435,value:"VioBlue"},
{key:1052,value:"VioBright 515"},
{key:1455,value:"VioBright 667"},
{key:698,value:"VioBright FITC"},
{key:1908,value:"Vio Bright R667"},
{key:1909,value:"Vio Bright R720"},
{key:1906,value:"Vio Bright V423"},
{key:437,value:"VioGreen"},
{key:670,value:"violetFluor 450"},
{key:1520,value:"violetFluor 500"},
{key:1907,value:"Vio R667"},
{key:1910,value:"Vio R720"},
{key:1129,value:"VivaFix 353/442"},
{key:1130,value:"VivaFix 398/550"},
{key:1132,value:"VivaFix 408/512"},
{key:1133,value:"VivaFix 410/450"},
{key:1134,value:"VivaFix 498/521"},
{key:1137,value:"VivaFix 547/573"},
{key:1138,value:"VivaFix 583/603"},
{key:1140,value:"VivaFix 649/660"},
{key:1732,value:"VivoTag 645"},
{key:1733,value:"VivoTag 680-XL"},
{key:1734,value:"VivoTag S680"},
{key:516,value:"VPD450"},
{key:1560,value:"VRDye 490"},
{key:1561,value:"VRDye 549"},
{key:612,value:"Vybrant DyeCycle Green"},
{key:693,value:"Vybrant DyeCycle Orange"},
{key:322,value:"Vybrant DyeCycle Ruby"},
{key:323,value:"Vybrant DyeCycle Violet"},
{key:1603,value:"X-Rhod-1 (Ca2+ bound)"},
{key:1605,value:"X-Rhod-5F (Ca2+ bound)"},
{key:83,value:"YFP"},
{key:572,value:"YO-PRO-1"},
{key:637,value:"YO-PRO-3"},
{key:812,value:"YOYO-1"},
{key:813,value:"YOYO-3"},
{key:1788,value:"Zinquin"},
{key:397,value:"Zombie Aqua"},
{key:398,value:"Zombie Green"},
{key:399,value:"Zombie NIR"},
{key:400,value:"Zombie Red"},
{key:402,value:"Zombie UV"},
{key:401,value:"Zombie Violet"},
{key:403,value:"Zombie Yellow"},
{key:493,value:"ZsGreen"}
]

const machinesData = [
{key:16294,value:"ACEA NovoCyte 1000"},
{key:16295,value:"ACEA NovoCyte 2000"},
{key:16296,value:"ACEA NovoCyte 2060"},
{key:16297,value:"ACEA NovoCyte 3000"},
{key:259806,value:"ACEA NovoCyte Quanteon"},
{key:297381,value:"Amnis CellStream 4 Laser"},
{key:297380,value:"Amnis CellStream 7 Laser"},
{key:297670,value:"Amnis FlowSight"},
{key:297665,value:"Amnis ImageStream - 1 camera"},
{key:297666,value:"Amnis ImageStream - 2 camera"},
{key:42,value:"BD Accuri C6"},
{key:152150,value:"BD Aria Fusion"},
{key:30,value:"BD Aria II"},
{key:31,value:"BD Aria III"},
{key:62,value:"BD Calibur  3 color"},
{key:21,value:"BD Calibur 4 color"},
{key:26,value:"BD FACSCanto"},
{key:28,value:"BD FACSCanto 2"},
{key:458,value:"BD FACSJazz"},
{key:372778,value:"BD FACS Lyric"},
{key:367390,value:"BD FACS Symphony A5"},
{key:446,value:"BD FACSVerse 4color"},
{key:443,value:"BD FACSVerse 6color"},
{key:450,value:"BD FACSVerse 8color"},
{key:32,value:"BD Influx"},
{key:2727,value:"BD LSR2"},
{key:8896,value:"BD LSR2 Fortessa X-20 (5 Laser)"},
{key:33,value:"BD LSR Fortessa"},
{key:27,value:"BD Vantage"},
{key:411128,value:"Beckman Coulter CytoFLEX LX N3-V5-B3-Y5-R3-I2"},
{key:411130,value:"Beckman Coulter CytoFLEX LX U3-V5-B3-Y5-R3-I2"},
{key:411125,value:"Beckman Coulter CytoFLEX S N2-V3-B5-R3"},
{key:411127,value:"Beckman Coulter CytoFLEX S N2-V4-B2-Y4"},
{key:411124,value:"Beckman Coulter CytoFLEX S V4-B2-Y4-R3"},
{key:411129,value:"Beckman Coulter CytoFLEX S V4-B4-R3-I2"},
{key:411123,value:"Beckman Coulter CytoFLEX V5-B5-R3"},
{key:411122,value:"Beckman Coulter DxFLEX"},
{key:411120,value:"Beckman Coulter Navios Ex"},
{key:67170,value:"Beckman Coulter Navios / Gallios"},
{key:248676,value:"Bio-Rad S3e 2 laser (B/R) 4 color"},
{key:248677,value:"Bio-Rad S3e 2 laser (B/Y) 4 color"},
{key:313636,value:"Bio-Rad S3e 3 laser (B/Y/R) 4 color"},
{key:313635,value:"Bio-Rad S3e 3 laser (V/B/R) 4 color"},
{key:246901,value:"Bio-Rad ZE5 3 laser (B/Y/R) 17 color"},
{key:246902,value:"Bio-Rad ZE5 3 laser (V/B/R) 17 color"},
{key:246729,value:"Bio-Rad ZE5 4 laser 24 color"},
{key:141788,value:"Bio-Rad ZE5 5 laser 27 color"},
{key:297377,value:"Guava easyCyte 12 &amp; 12HT"},
{key:297375,value:"Guava easyCyte 5 &amp; 5HT"},
{key:297376,value:"Guava easyCyte 8 &amp; 8HT"},
{key:297378,value:"Guava easyCyte B/G/R &amp; B/G/RHT"},
{key:297379,value:"Guava easyCyte B/G/V &amp; B/G/VHT"},
{key:297374,value:"Guava Muse"},
{key:44,value:"iCyte Reflection"},
{key:46,value:"ImageStream"},
{key:64768,value:"ImageStream Blue/Red 6 color"},
{key:94068,value:"IntelliCyt iQue Screener"},
{key:94069,value:"IntelliCyt iQue Screener Plus"},
{key:1241,value:"JSAN 4 laser"},
{key:684,value:"JSAN 8color [405-488-561nm]"},
{key:1238,value:"JSAN Jr  Swift"},
{key:3020,value:"Miltenyi Biotec MACSQuant Analyzer 10 (8 color)"},
{key:324946,value:"Miltenyi Biotec MACSQuant Analyzer 16"},
{key:3016,value:"Miltenyi Biotec MACSQuant Analyzer (7 color)"},
{key:324989,value:"Miltenyi Biotec MACSQuant Tyto Cell Sorter"},
{key:3027,value:"Miltenyi Biotec MACSQuant VYB"},
{key:226711,value:"Miltenyi Biotec MACSQuant X"},
{key:52,value:"Stratedigm S1000"},
{key:4280,value:"Stratedigm SE500"},
{key:4282,value:"Stratedigm SE520 EXi"},
{key:90589,value:"Sysmex CyFlow Cube 6 Blue"},
{key:90590,value:"Sysmex CyFlow Cube 6 Blue Red"},
{key:90591,value:"Sysmex CyFlow Cube 8 Blue Red"},
{key:90592,value:"Sysmex CyFlow Cube 8 UV Blue Red"},
{key:90593,value:"Sysmex CyFlow Cube 8 Violet Blue Red"},
{key:90588,value:"Sysmex CyFlow ML"},
{key:90585,value:"Sysmex CyFlow SL"},
{key:90586,value:"Sysmex CyFlow Space Blue Red"},
{key:90587,value:"Sysmex CyFlow Space UV Blue Red"},
{key:208772,value:"ThermoFisher Attune NxT (Blue/Green)"},
{key:208773,value:"ThermoFisher Attune NxT (Blue/Green/Red)"},
{key:208776,value:"ThermoFisher Attune NxT (Blue/Green/Red/Violet)"},
{key:208774,value:"ThermoFisher Attune NxT (Blue/Green/Violet)"},
{key:208778,value:"ThermoFisher Attune NxT (Blue/Red/Violet 6)"},
{key:208779,value:"ThermoFisher Attune NxT (Blue/Red/Yellow/Violet 6)"},
{key:208777,value:"ThermoFisher Attune NxT (Blue/Violet 6)"},
{key:141785,value:"YETI"},
{key:465836,value:"ACEA NovoCyte Advanteon R4Y6B7"},
{key:465837,value:"ACEA NovoCyte Advanteon V6Y4B5"},
{key:465838,value:"ACEA NovoCyte Advanteon V8B7R4"},
{key:461409,value:"BD FACSCelesta V-B"},
{key:461412,value:"BD FACSCelesta V-B-R"},
{key:461413,value:"BD FACSCelesta V-B-UV"},
{key:461411,value:"BD FACSCelesta V-B-Y"},
{key:505206,value:"Sony FX500 Cell Sorter 1 Laser (B)"},
{key:505208,value:"Sony FX500 Cell Sorter 2 Laser (B/R)"},
{key:505207,value:"Sony FX500 Cell Sorter 2 Laser (B/Yg)"},
{key:505209,value:"Sony FX500 Cell Sorter 3 Laser (B/R/Yg)"},
{key:505210,value:"Sony MA900 Cell Sorter 2 Laser (B/R)"},
{key:505212,value:"Sony MA900 Cell Sorter 2 Laser (B/V)"},
{key:505213,value:"Sony MA900 Cell Sorter 3 Laser (B/R/V)"},
{key:505211,value:"Sony MA900 Cell Sorter 3 Laser (B/R/Yg)"},
{key:505215,value:"Sony MA900 Cell Sorter 3 Laser (B/V/Yg)"},
{key:505214,value:"Sony MA900 Cell Sorter 4 Laser (B/R/V/Yg)"},
{key:505217,value:"Sony SH800 Cell Sorter 1 Laser (B)"},
{key:505220,value:"Sony SH800 Cell Sorter 2 Laser (B/R)"},
{key:505218,value:"Sony SH800 Cell Sorter 2 Laser (B/V)"},
{key:505219,value:"Sony SH800 Cell Sorter 2 Laser (B/Yg)"},
{key:505223,value:"Sony SH800 Cell Sorter 3 Laser (B/R/V)"},
{key:505222,value:"Sony SH800 Cell Sorter 3 Laser (B/R/Yg)"},
{key:505221,value:"Sony SH800 Cell Sorter 3 Laser (B/V/Yg)"},
{key:505224,value:"Sony SH800 Cell Sorter 4 Laser (B/R/V/Yg)"},
{key:513218,value:"PerkinElmer Opera Phenix"},
{key:526663,value:"Bio-Rad S3e 3 laser (V/B/Y) 4 color"},
{key:517440,value:"IntelliCyt iQue 3 BR"},
{key:517437,value:"IntelliCyt iQue 3 VBR"},
{key:517438,value:"IntelliCyt iQue 3 VYB"},
{key:"Custom Instrument",value:"Custom Instrument"}
]

export const sectionList = [
    {
        id:1,
        name:"device",
        label:"To optimize analysis please select your Device",
        dataList:machinesData,
        placeholder:"Please select a device",
        optKey:"device"
    },
    {
        id:2,
        name:"cell_type",
        label:"What is the cell type are you measuring?",
        dataList:cellTypeList,
        placeholder:"Please select a Cell Type",
        optKey:"cell_type"
    },
    {
        id:3,
        name:"particles_size",
        label:"How big are the particles you are measuring?",
        dataList:particlesSizeList,
        placeholder:"Please select a Particle Size",
        optKey:"particles_size"
    },
    {
        id:4,
        name:"fluorophores",
        label:"Select the fluorophores in your analysis",
        dataList:fluorophoresData,
        placeholder:"Please select a fluorophores",
        optKey:"fluorophores"
    },
]