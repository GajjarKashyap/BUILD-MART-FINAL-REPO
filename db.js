// db.js - Browser Storage Database Manager

const DB_KEY = 'buildmart_db';
const DEFAULT_CATEGORY_TAXONOMY = {
    "Power Tools": ["Drill Machines", "Angle Grinders", "Circular Saws", "Jigsaws", "Rotary Hammers", "Impact Drivers", "Sanders", "Heat Guns", "Electric Screwdrivers", "Polishers"],
    "Hand Tools": ["Hammers", "Screwdrivers", "Pliers", "Wrenches", "Spanners", "Chisels", "Measuring Tapes", "Utility Knives", "Clamps", "Spirit Levels"],
    "Tools & Accessories": ["Drill Bits", "Screwdriver Bits", "Saw Blades", "Grinding Wheels", "Cutting Discs", "Sanding Discs", "Hole Saws", "Router Bits", "Wire Brushes", "Polishing Pads"],
    "Fasteners & Small Hardware": ["Screws", "Nails", "Bolts", "Washers", "Wall Plugs & Anchors", "Rivets", "Staples", "Hooks & Eyes", "Pins & Clips"],
    "Wood Glues & Adhesives": ["Wood Glues", "General Adhesives", "PVA Adhesives", "Epoxy Adhesives", "Contact Adhesives", "Construction Adhesives", "Instant Adhesives"]
};

// Default seed catalog for GitHub Pages and fresh browser visitors
const DEFAULT_SEED_PRODUCTS = [
    {
        "product_serial_id": 1000001,
        "sku": "BM-PT-DR-0001",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "IBELL VORMIR ID13-75 Impact Drill ",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3735,
            "selling_price": 2490,
            "discount_percent": 33
        },
        "stock_quantity": 15,
        "short_description": "IBELL VORMIR ID13-75 Impact Drill | 650W Motor | Dual Mode (Drilling & Impact) | 13mm Chuck | 0–2800 RPM Variable Speed | Forward/Reverse | Copper Armature | 1-Year Warranty",
        "features": [
            "Adjustable Speed & 10mm Keyless Chuck : Our drill machine offers 2 adjustable speed setting ( Low / High ) for effortless speed selection for your work requirement. While its 10MM keyless chuck helps you effortlessly changes the bits, providing versatility, durability, superior gripping power, precise drilling control, and efficient time-saving.",
            "Warranty Service : This drill machine with 6-months carry-in warranty from the invoice date (invoice copy needed for claims). Please note that the warranty covers only the machine motor; accessories are not covered under this warranty."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "RPM",
                "value": "2800"
            },
            {
                "key": "Chuck Size",
                "value": "13 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "2 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "6 Months",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/81ww-zUYeoL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81fnKjGiD3L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81rg2kLQupL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71ZVygn5ezL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/IBELL-VORMIR-ID13-75-Drilling-Variable/dp/B0FBK9C7HY/ref=sr_1_1_sspa?crid=2VB3TDQ0JDSXU&dib=eyJ2IjoiMSJ9._fvxQ8Eplstoi-U62ZuhQ4sVRmvKnelVLXDIqU1gL0fM545LTk0LCT8zruZOu7t73WUuVlULJVyp2mUqXGe2meBebYzp_zWh2pkVWl4rmg24PbuBszg9HYTxm1prW-GDGHxXnc8c7cXgLalKaxVjl0DYGhdUv_nbqqLeguy-yRpFLBUbZ0PeNtfsS0-njGkCuPpe68Te8cBEb_PXoUrmJC7PZR4s_zIC-U0B42aCQkGnwzSjLckV83BJHL5L19eS_v6ImO5cl-TPV88wuO4sxINeYZ34iHR0hUWRgqDVzO4.nGrT6_CGAWQIO--g3lyBK-8LkYU3iWn4BVowdshGf-o&dib_tag=se&keywords=drills&qid=1783010370&sprefix=dril%2Caps%2C272&sr=8-1-spons&aref=vEC6fkMKp1&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
        "updated_at": "2026-07-03T02:37:10.548Z",
        "created_at": "2026-07-02T17:06:29.548Z"
    },
    {
        "product_serial_id": null,
        "sku": "BM-PT-DR-0002",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "IBELL Impact Drill ID13-80",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 4923,
            "selling_price": 2814,
            "discount_percent": 42.84
        },
        "stock_quantity": 10,
        "short_description": "IBELL Impact Drill ID13-80, 650W, Copper Armature, Chuck 13mm Keyless Auto, 2800 RPM, 2 mode selector, Forward/Reverse with variable speed",
        "features": [
            "Powerful 650W motor with variable speed (0–2800 RPM) Delivers reliable performance for drilling in wood (25mm), steel (12mm), and concrete (13mm) with a 13mm automatic chuck for quick and easy bit changes.",
            "Dual mode operation – Drilling and Impact Hammer Easily switch between standard drilling and impact hammer mode for efficient work on wood, metal, and masonry surfaces.",
            "2-speed mechanical gear control for torque and speed adjustment Gear 1 (-) provides low speed with high torque for heavy-duty applications; Gear 2 (+) offers high speed for lighter, faster drilling tasks."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "650 VW"
            },
            {
                "key": "RPM",
                "value": "2800"
            },
            {
                "key": "Chuck Size",
                "value": "13 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "1 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "Masonry Drill Bits",
            "Steel Drill Bits",
            "Wood Drill Bits",
            "Screwdriver Heads",
            "Screwdriver Head Adaptor",
            "Depth Gauge",
            "Auxiliary Handle."
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71RqF+ZaTZL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81QzwdA0zZL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81deqJn5wAL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71RH5ANNDpL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/IBELL-ID13-80-Armature-selector-variable/dp/B07DCT2L6H/ref=sr_1_2_sspa?crid=2VB3TDQ0JDSXU&dib=eyJ2IjoiMSJ9._fvxQ8Eplstoi-U62ZuhQ4sVRmvKnelVLXDIqU1gL0fv-R6vGv5vGqgWWkgrnBzNFK3o0OEfTm2yNW9g-RjxGuBebYzp_zWh2pkVWl4rmg24PbuBszg9HYTxm1prW-GDGHxXnc8c7cXgLalKaxVjl0DYGhdUv_nbqqLeguy-yRpFLBUbZ0PeNtfsS0-njGkCuPpe68Te8cBEb_PXoUrmJC7PZR4s_zIC-U0B42aCQkGnwzSjLckV83BJHL5L19eS_v6ImO5cl-TPV88wuO4sxINeYZ34iHR0hUWRgqDVzO4.8SPU2rIHLoMzzuLQFTr02wX3h5EfTnJba9mpGiPaEWM&dib_tag=se&keywords=drills&qid=1783011634&sprefix=dril%2Caps%2C272&sr=8-2-spons&aref=2snqBqhZko&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
        "updated_at": "2026-07-02T17:55:09.216Z",
        "created_at": "2026-07-02T17:55:09.216Z"
    },
    {
        "product_serial_id": 1,
        "sku": "BM-PT-DR-0003",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "BOSCH GSB 600 Impact Drill Machine ",
        "brand": {
            "display": "Bosch",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3124,
            "selling_price": 2499,
            "discount_percent": 20.01
        },
        "stock_quantity": 17,
        "short_description": "600W Motor | 13mm Chuck | 3000 RPM | 48000 BPM | Variable Speed | Double Insulation | 1 Year Warranty",
        "features": [
            "Powerful Tool: The BOSCH GSB 600 Corded Electric Impact Drill is a robust and long-lasting drill machine powered by a 600 W motor. It is capable of handling demanding tasks and is designed to endure with its high-quality construction. Additionally, the new carbon brush incorporated into the drill contributes to its longevity.",
            "Variable Speed: The electric drill provides easy speed control, which is beneficial for precision work. When no load, the first gear can reach a rotation speed of up to 3000 RPM and can deliver as many as 48000 BPM.",
            "Rated Torque and Chuck Capacity: The electric corded impact drill offers a torque of 1.4 Nm, which is sufficient for standard drilling activities. The chuck, which secures the drill bit, accommodates bits with a maximum diameter of 13 mm."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket"
            },
            {
                "key": "Voltage",
                "value": "240 V"
            },
            {
                "key": "RPM",
                "value": "3000"
            },
            {
                "key": "Chuck Size",
                "value": "13 mm"
            },
            {
                "key": "Amperage",
                "value": "14 Amps"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic",
            "weight": "1.4 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "BOSCH GSB 600 Impact Drill Machine",
            "Drill Attachment"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61Z0NDRt+4L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61KhuRyCGYL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81-CiOHIXxL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71MCnKIE0wL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Bosch-Electric-Variable-Rotation-Insulation/dp/B0C3RD8YNM/ref=sr_1_1_sspa?crid=Q6QU2AW3WJQK&dib=eyJ2IjoiMSJ9.EHMuCmYMdTmzA-UUGYSKcL6r8rF7ww_HB33LEfzg0mvYjxl70IzOnTztIM5S6u13hRu07PHZM9a4IEY_IR7pGJYLEGuUg-lmQAMeDqRbJKDxJdw6yyuHQ6fiGOdyGsPlEIRwJ5Kpnld5JiZcD2DfY1h0mQTZsmInFyKkG5A1zqNp-n9wJotG3yjKasYEJByDANEvjOBVFR6wg7n57YX2wbOVd_MZwcwVTHHMbr66uFQA4JUwf7HgthyABq-hK2hFsR45vqTMu9Y0gXfe4AlsWO2fVO6af1nRJRloeSb1la4.IbR2nG7ewMVJDqDPQJEVGsyNmlVxB3nK9o6ZMCEfd5M&dib_tag=se&keywords=drills%2Bmachine&qid=1783014945&sprefix=drills%2Caps%2C691&sr=8-1-spons&aref=HuReXPzPm2&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
        "updated_at": "2026-07-02T18:02:00.189Z",
        "created_at": "2026-07-02T18:02:00.189Z"
    },
    {
        "product_serial_id": 2,
        "sku": "BM-PT-DR-0004",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "BOSCH GSB 183-Li Cordless Impact Drill",
        "brand": {
            "display": "Bosch",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 13536,
            "selling_price": 9024,
            "discount_percent": 33.33
        },
        "stock_quantity": 9,
        "short_description": "Cordless for maximum freedom, convenience, and safety\nSuitable for a range of applications, even masonry, due to impact drilling function\nElectronic features protect the motor and extend the battery life",
        "features": [
            "Compatible with all Bosch 18V batteries and chargers",
            "Ideal for driving screws into wood and drilling into masonry, metal, and wood; Package Contents: Cordless Impact Drill/Drivers With 2 Battery"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Bettry Powerd"
            },
            {
                "key": "Voltage",
                "value": "18 V"
            },
            {
                "key": "Power (Wattage)",
                "value": ""
            },
            {
                "key": "RPM",
                "value": "1815"
            },
            {
                "key": "Chuck Size",
                "value": "10 mm"
            }
        ],
        "additional_info": {
            "material": "Metal",
            "weight": "3.4 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "Drill Attachment"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71hisd+0o6L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71HQNRj-EfL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61Oo9BgabwL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61ncGlTSQTL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/dp/B0D2NPL3B9/ref=sspa_dk_detail_5?psc=1&pd_rd_i=B0D2NPL3B9&pd_rd_w=WXIQ2&content-id=amzn1.sym.9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_p=9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_r=ZCSHAM8QDRFH5E88VF7D&pd_rd_wg=CJQJD&pd_rd_r=a6ab3798-c0d8-4126-90cb-6ba230ffef4c&aref=kSxvluDU1Q&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy",
        "updated_at": "2026-07-02T18:08:08.363Z",
        "created_at": "2026-07-02T18:08:08.363Z"
    },
    {
        "product_serial_id": 3,
        "sku": "BM-PT-DR-0005",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "BOSCH GBH 220 Corded Electric Rotary Hammer with SDS Plus",
        "brand": {
            "display": "Bosch",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 7356,
            "selling_price": 4849,
            "discount_percent": 34.08
        },
        "stock_quantity": 17,
        "short_description": "BOSCH GBH 220 Corded Electric Rotary Hammer with SDS Plus, 720 W, 2 J, 2.3 Kg, 3 Modes, For Concrete, Metal & Wood + Carrying case, , 1 Year Warranty from BOSCH, Blue",
        "features": [
            "Strong Motor, High Impact Energy & Compact Design: The 720-watt motor delivers impressive power, making it effective for hammer drilling into concrete. The 2.0 joules of impact energy provide enough force to drill through tough materials. The rotary hammer has a compact design, making it easier to carry and use, especially in small areas, while still providing professional-grade performance.",
            "Three-Mode Rotary Hammer & SDS Plus: This tool can function in three modes: hammer drilling for concrete, standard drilling for materials like wood and metal, and light chiseling for wall cheasing or shaping concrete surface. SDS Plus provides optimal power transmission. SDS Plus Chuck System allows for quick and secure bit changes ensuring seamless transitions between drilling or hammering tasks."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "720 w"
            },
            {
                "key": "RPM",
                "value": "1550"
            },
            {
                "key": "Chuck Size",
                "value": "30 mm"
            },
            {
                "key": "Amperage",
                "value": "14 Amps"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "2.3 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "GBH 220 Rotary Hammer – Part No: 06112A60F0"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61q1LgyVRpL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/514fBfat-QL._SL1112_.jpg",
                "https://m.media-amazon.com/images/I/A1I2JLszlwL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/91aZWf04jfL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/91aqb7tzoFL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/916JwuAQFkL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Bosch-Concrete-Electric-Professional-720Watt/dp/B08T8ZK7JH/ref=sr_1_18?crid=Q6QU2AW3WJQK&dib=eyJ2IjoiMSJ9.EHMuCmYMdTmzA-UUGYSKcL6r8rF7ww_HB33LEfzg0mvYjxl70IzOnTztIM5S6u13hRu07PHZM9a4IEY_IR7pGJYLEGuUg-lmQAMeDqRbJKDxJdw6yyuHQ6fiGOdyGsPlEIRwJ5Kpnld5JiZcD2DfY1h0mQTZsmInFyKkG5A1zqNp-n9wJotG3yjKasYEJByDANEvjOBVFR6wg7n57YX2wbOVd_MZwcwVTHHMbr66uFQA4JUwf7HgthyABq-hK2hFsR45vqTMu9Y0gXfe4AlsWO2fVO6af1nRJRloeSb1la4.IbR2nG7ewMVJDqDPQJEVGsyNmlVxB3nK9o6ZMCEfd5M&dib_tag=se&keywords=drills%2Bmachine&qid=1783014945&sprefix=drills%2Caps%2C691&sr=8-18&th=1",
        "updated_at": "2026-07-02T18:14:00.080Z",
        "created_at": "2026-07-02T18:14:00.080Z"
    },
    {
        "product_serial_id": 4,
        "sku": "BM-PT-DR-0006",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "INGCO Impact Drill 87B",
        "brand": {
            "display": "INGCO",
            "normalized": "ingco"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 2442,
            "selling_price": 1850,
            "discount_percent": 24.24
        },
        "stock_quantity": 16,
        "short_description": "INGCO Impact Drill, 680W | 0-3000rpm | 13mm Power Hammer Drills, Variable Speed Corded Drill Machine, Froward/Reverse Switch Electric Drill with Depth Gauge Home Improvement Construction Concrete",
        "features": [
            "【680W Pure Copper Motor Corded Drills】INGCO power impact hammer corded drill is equipped with 680W pure copper mooring, and the power drill concrete produces 0-2800/min variable speed to meet different requirements. providing powerful impact and hammer resistance to complete heavy projects in wood, masonry, solid steel and concrete, meaning most job needs can be met."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "RPM",
                "value": "3000"
            },
            {
                "key": "Chuck Size",
                "value": "10 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic",
            "weight": "1 kg",
            "country_of_origin": "Germany"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61OhZpEVQrL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/815b8qRXIQL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71y+Vs8pzpL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71IJ+yxijNL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/819Y9GY20qL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/INGCO-Drill-Power-Improvement-Construction/dp/B09VXML2NL/ref=sr_1_19?crid=Q6QU2AW3WJQK&dib=eyJ2IjoiMSJ9.EHMuCmYMdTmzA-UUGYSKcL6r8rF7ww_HB33LEfzg0mvYjxl70IzOnTztIM5S6u13hRu07PHZM9a4IEY_IR7pGJYLEGuUg-lmQAMeDqRbJKDxJdw6yyuHQ6fiGOdyGsPlEIRwJ5Kpnld5JiZcD2DfY1h0mQTZsmInFyKkG5A1zqNp-n9wJotG3yjKasYEJByDANEvjOBVFR6wg7n57YX2wbOVd_MZwcwVTHHMbr66uFQA4JUwf7HgthyABq-hK2hFsR45vqTMu9Y0gXfe4AlsWO2fVO6af1nRJRloeSb1la4.IbR2nG7ewMVJDqDPQJEVGsyNmlVxB3nK9o6ZMCEfd5M&dib_tag=se&keywords=drills+machine&qid=1783014945&sprefix=drills%2Caps%2C691&sr=8-19",
        "updated_at": "2026-07-02T18:19:17.828Z",
        "created_at": "2026-07-02T18:19:17.828Z"
    },
    {
        "product_serial_id": 5,
        "sku": "BM-PT-DR-0007",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "BUILDSKILL 175 Pcs 21V Impact Brushless Cordless Drill Machine Toolkit ",
        "brand": {
            "display": "BUILDSKILL",
            "normalized": "buildskill"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 11373,
            "selling_price": 6499,
            "discount_percent": 42.86
        },
        "stock_quantity": 13,
        "short_description": "BUILDSKILL 175 Pcs 21V Impact Brushless Cordless Drill Machine Toolkit | 40NM Torque | Copper Motor | 2-Speed 400/1400 RPM | 10mm Metal Keyless Chuck | Forward-Reverse | Professional & DIY Use",
        "features": [
            "175 Pieces Brushless Cordless Drill Toolkit: BUILDSKILL 175 pieces 21V brushless cordless drill machine toolkit is perfect for tackling everything from simple fixes to ambitious DIY projects. With a wide array of tools, you’ll be ready for any challenge—whether it’s hanging shelves or assembling furniture. This toolset empowers you to unleash your creativity and transform your living space effortlessly!",
            "21V Brushless & Cordless Impact Drill: The 21V cordless drill machine features a brushless copper motor for powerful, efficient, and long-lasting performance. Ideal drill machine for wall drilling, home use, and professional projects. This electric cordless drilling machine is part of a reliable drill machine kit designed for effortless drilling on any surface.",
            "Dual Speed & Forward/Reverse Control: The brushless cordless drilling machine offers dual-speed control (0–400 / 0–1400 RPM) for precise drilling and screwdriving. The forward/reverse function ensures smooth, effortless control for every drill machine for home or professional task."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Li-ion battery"
            },
            {
                "key": "Voltage",
                "value": "21 V"
            },
            {
                "key": "Power (Wattage)",
                "value": ""
            },
            {
                "key": "RPM",
                "value": "1440"
            },
            {
                "key": "Chuck Size",
                "value": "10 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "",
            "country_of_origin": ""
        },
        "warranty_period": "",
        "warranty_type": "",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "1 x 21V Cordless Brushless Drill Machine",
            "1 x 1.5Ah Battery with 0.6A Charger",
            "Long Nose Plier x 1 6 Combination Plier x 1,8",
            "Adjustable Wrench x 1,8Oz Claw Hammer x 1,1/4",
            "CR-V Socket (5 - 6 - 7 - 8 - 9 - 10 - 11 - 12 - 13MM) x 9",
            "3M Measuring Tape x 1",
            "Utility Knife x 1",
            "Flexible Shaft 30CM x 1",
            "Alen Keys (1.5 - 2 - 2.5 - 3 - 4 - 5 - 5.5 - 6MM):",
            "8,5M Electrical Tape x 1 Wood Drill 3MM x 1,Wood Drill 5MM x 1,Wood Drill 6MM x 1,HSS Drill Bit 3MM Black x 1,HSS Drill Bit 5mm Black x 1,HSS Drill Bit 6mm Black x 1,Masonry Drill Bit (3 x 60MM) x 1,Masonry Drill Bit (5 X 85MM) x 1,Masonry Drill Bit (6 x 100MM) x 1,Multipurpose Drill Bits 6MM x 1 Wood Flat Drill 13MM x 1,Wood Flat Drill 16MM x 1,Screwdriver Bits 50MM ( SL3, SL4, SL5, SL6, PH1, PH2, PH3, T10, T20, AD): 10,Screws 50MM x10,Screws 40MM x10,Wall Plugs 38MM x 10,Wall Plugs 32MM x 10,Screw Caps x 10,Nails x 80"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/81thWRhyc-L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81aKbsRDDxL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/819Y+VakjEL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81vWpXj5MeL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/811USwP2ECL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81VrtP0zwbL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/BUILDSKILL-Cordless-Machine-Forward-Reverse-Professional/dp/B0G3QF4DHK/ref=sr_1_6?crid=Q6QU2AW3WJQK&dib=eyJ2IjoiMSJ9.P5eSCVFMwUhTXBC46vjA7Igf5qXcCoNMO4pu-Y0jm3wiTnHPBBFSL09W-SmyYysGeifg3FB9nFNQtV3cQZUbYQi-YXOJNh0hRr5JQqf9XjOW3tLX1Xw93LyEbXTU_qHq-FatW11HXu0cvSp5XybZeU6V2ORHg0Q0SUkTb1TE158R5OUbkPOQIyWi9JAvjQzwwJYD5CnizTvUtyzJVRG_e1Pd8fzGyPz10MSkLL1hb8bWVLGhnLlNkrPMfH7PkoZO6PbFyc9_1hZzpaWSgMHfEQHAURsNVIyUUvYOk7x1QjU.PgeUx8TcMtMgww-v3UPeHCccoqCpNDa5J9smSpY0zdA&dib_tag=se&keywords=drills%2Bmachine&qid=1783016389&refinements=p_36%3A540000-&rnid=3444809031&sprefix=drills%2Caps%2C691&sr=8-6&th=1",
        "updated_at": "2026-07-02T18:27:09.754Z",
        "created_at": "2026-07-02T18:27:09.754Z"
    },
    {
        "product_serial_id": 13,
        "sku": "BM-PT-DR-0008",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "BOSCH Professional GSR 120 Li Cordless Drill",
        "brand": {
            "display": "BOSCH",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 6298,
            "selling_price": 3599,
            "discount_percent": 42.85
        },
        "stock_quantity": 19,
        "short_description": "High performance professional tool by BOSCH.",
        "features": [
            "Home Improvement›Power & Hand Tools›Power Tools›Drills›Drill Drivers",
            "Power Source\tBattery Powered",
            "Maximum Rotational Speed\t1500 RPM",
            "Torque Settings: The cordless drill driver provides 20+1 torque settings providing versatility of various screwdriving and drilling applications.",
            "TUQO SB20Y, DrillBrush Attachment Set - Power Scrubber Brush Cleaning Kit - for Bathroom Surfaces, Grout, Floor, Tile, Corner",
            "Serplex® 6Pcs Drill Bit Set & 5Pcs Screw Extractors, M3-M10 Metric Sizes, High-Speed Steel Drill Bits, Universal 1/4",
            "Lifelong 12V Cordless Drill Machine For Home Use|Cordless Screw Driver Machine|2-Speed, 0-1500Rpm|1-10Mm Chuck For Home Use|D",
            "BOSCH GSB 600 Impact Drill Machine for Home & Professional Use, 100Pcs Accessory Kit | 600W Motor | 13mm Chuck | 3000 RPM | 4",
            "BUILDSKILL 21V Impact Brushless Cordless Drilling Machine | 40NM Torque | Copper Motor | 2-Speed 400/1400 RPM | 10mm Metal Ke",
            "BOSCH GSR 120-Li Professional 12V Cordless Drill Driver Kit |10mm Chuck Size| No-load Speed (1st/2nd)- 0-400/0-1500 RPM | Tor",
            "BLACK+DECKER LD12SP 12V 10mm Li-ion Cordless Variable Speed Reversible Drill Machine Driver with 10 Screwdriver & 2 Drill Mac",
            "Maximum Torque\t30 Newton Meters"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "2800 RPM"
            },
            {
                "key": "Chuck Size",
                "value": "10 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic",
            "weight": "1.2 Kg",
            "country_of_origin": "India"
        },
        "warranty_period": "1 Year Warranty",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61dzwNelWaL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/710JP1tDFGL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71jbfYBW24L._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/dp/B07WLVV8Y3/ref=sspa_dk_detail_6?pd_rd_i=B07WLVV8Y3&pd_rd_w=jFhzX&content-id=amzn1.sym.9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_p=9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_r=MRDD0TAECZTAC5CR3G5P&pd_rd_wg=Rinzr&pd_rd_r=a3611a10-0b32-4f39-a2b6-09281aee0b9f&aref=h5hQ8AhbOQ&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy&th=1",
        "updated_at": "2026-07-02T19:25:55.427Z",
        "created_at": "2026-07-02T19:25:55.427Z"
    },
    {
        "product_serial_id": 15,
        "sku": "BM-PT-DR-0009",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "Bosch GSB 16 RE Heavy Duty Corded Electric Impact Drill",
        "brand": {
            "display": "BOSCH",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 10472,
            "selling_price": 7756,
            "discount_percent": 25.94
        },
        "stock_quantity": 16,
        "short_description": "Bosch GSB 16 RE Heavy Duty Corded Electric Impact Drill, 750W, 1.8 kg, 2.1 Nm, 3,250 rpm, 13 mm Chuck, Compact Design, W - High performance professional tool by BOSCH.",
        "features": [
            "Power Source\tCorded",
            "Maximum Rotational Speed\t3000 RPM",
            "Additional Features\tLock Speed Button",
            "Maximum Torque\t2.1 Newton Meters",
            "Speed\t3250 RPM",
            "Maximum Power\t750 Watts",
            "Torque\t2.1 Newton Meters"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "750 W"
            },
            {
                "key": "RPM",
                "value": "3000 RPM"
            },
            {
                "key": "Chuck Size",
                "value": "0.51 mm"
            }
        ],
        "additional_info": {
            "material": "Hardened Alloy Steel",
            "weight": "1.8 kg",
            "country_of_origin": "India"
        },
        "warranty_period": "1 Year Warranty",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "Drill Attachment"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71hFlU2LorL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71e-XWRc8ZL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/7176f8s0rbL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Corded-Electric-Compact-Auxiliary-Warranty/dp/B019H48L1E/ref=pd_sbs_d_sccl_2_8/523-9897852-6127730?pd_rd_w=J6hjX&content-id=amzn1.sym.d1406b44-aa69-47e4-9270-f613e12d52dc&pf_rd_p=d1406b44-aa69-47e4-9270-f613e12d52dc&pf_rd_r=2TZSM81TE1HMX6K46KPM&pd_rd_wg=u9EPP&pd_rd_r=f1adab53-1a0a-47a7-941b-574578069877&pd_rd_i=B019H48L1E&th=1",
        "updated_at": "2026-07-02T19:31:39.093Z",
        "created_at": "2026-07-02T19:31:39.093Z"
    },
    {
        "product_serial_id": 16,
        "sku": "BM-PT-DR-0010",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "IBELL Rotary Hammer Drill RH26-26",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 8099,
            "selling_price": 5399,
            "discount_percent": 33.34
        },
        "stock_quantity": 10,
        "short_description": "IBELL Rotary Hammer Drill RH26-26, 780W, Copper Armature, SDS Plus Chuck :26 mm, 900 RPM, Impact Energy 3J with Vibration Control - High performance professional tool by IBELL.",
        "features": [
            "Heavy duty copper motor for maximum performance and longer life",
            "Ergonomic handle grip design for comfortable handling during long operations",
            "Precision engineered mechanism suitable for professional and DIY home use",
            "Built with high impact resistant materials for extreme durability",
            "Compact and lightweight construction reduces hand fatigue during prolonged use"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "780 W"
            },
            {
                "key": "RPM",
                "value": "900 RPM"
            },
            {
                "key": "Chuck Size",
                "value": "26 mm"
            }
        ],
        "additional_info": {
            "material": "Copper / Alloy Steel",
            "weight": "1.8 kg",
            "country_of_origin": "India"
        },
        "warranty_period": "6 Months",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "DRILL"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/81CA411Q-jL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81HWgkaPqrL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81-LPaqjfXL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/dp/B085ZXTRJ9/ref=sspa_dk_detail_0?psc=1&pf_rd_p=9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_r=DGTXG7NZ2YTMSNGBNFX7&pd_rd_wg=P0oOS&pd_rd_w=XKbVR&content-id=amzn1.sym.9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pd_rd_r=ad5d3479-9bc4-4097-9d96-671884814ff7&aref=fF8jtkLd15&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy",
        "updated_at": "2026-07-02T19:36:51.343Z",
        "created_at": "2026-07-02T19:36:51.343Z"
    },
    {
        "product_serial_id": 1,
        "sku": "BM-PT-DR-0011",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "KROST Cordless Drill Kit - 21V(37V MAX) Electric Drill ",
        "brand": {
            "display": "KROST",
            "normalized": "krost"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 22999,
            "selling_price": 20500,
            "discount_percent": 11
        },
        "stock_quantity": 10,
        "short_description": "\nClick to see full view\nKROST Cordless Drill Kit - 21V(37V MAX) Electric Drill Tool Combo 9-In-1 Multi-Head Power with 2Pcs Lithium-Ion Batteries and Storage Box, Combo Kit 9-Tool (Kit)",
        "features": [
            "【Lightweigh & Quickly】-- KROST Cordless Power Drill Set 21V(37V MAX)power tool combo kit weigh only ‎6.2kg, you can control them at ease,and operate the drivers. And impact Driver Kit the ergonomic non-slip handle is comfortable for you to grip",
            "【Versatile Use】-- KROST Cordless Power Drill Set is cost-effective and powerful drillQuick Connect system allows quick and easy change of a variety of attachments, for completing a variety of applications. assembling or repairing furniture, tightening screws and many other DIY and craft projects.Making your work more efficient and convenient"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "2800 RPM"
            },
            {
                "key": "Chuck Size",
                "value": "10 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "1.2 Kg",
            "country_of_origin": "India"
        },
        "warranty_period": "6 month",
        "warranty_type": "Replacement Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61J7URYDpYL._SL1129_.jpg",
                "https://m.media-amazon.com/images/I/614bgjSAL9L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61egIWOGkEL._SL1300_.jpg",
                "https://m.media-amazon.com/images/I/61wzXmfV8pL._SL1426_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/KROST-Cordless-Drill-Kit-Lithium-Ion/dp/B0BHL43GZC/ref=sr_1_3?crid=34AA2DC2S2TRZ&dib=eyJ2IjoiMSJ9.0Yla-GEVewHP0uLHZRqffLf8VeNrizv9AHjv_9M5gz0f5EBpAakV-V70ZuONOajougsiiYFXgXa1NYf7tVSO1ZqUMTCTgP0Xg-Zmdxn5BjgiY_3aXyryQPckLL7wO9Y-4Zy3TWGYbdXdACv7h2XawDD4CmMJ2pflNCjNKKsLHf3AUjH51u9teFaPDyJb_mLyfj6TiLMzUfKkKfMFS7f1KYRG3JAxFILCwjMbCyUQlbxaU-kzV0RWITcomYKJ3fyP70bzEzqaXaskhyJYcf29YDfY31mE_8l448LHj4zftD4.K8UhhM2tYa0X3Elpb4kT4w0GQJz8LVvgrgZwonKOiC8&dib_tag=se&keywords=power+drills&qid=1783041814&refinements=p_36%3A1600000-&rnid=3444809031&sprefix=powe%2Caps%2C2577&sr=8-3",
        "updated_at": "2026-07-03T01:50:41.098Z",
        "created_at": "2026-07-03T01:32:54.196Z"
    },
    {
        "product_serial_id": 6,
        "sku": "BM-PT-DR-0012",
        "category": "Power Tools",
        "subcategory": "Drill Machines",
        "name": "JPT 21V Heavy-Duty Impact Cordless Drill Machine",
        "brand": {
            "display": "JPT",
            "normalized": "jpt"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3623,
            "selling_price": 2898,
            "discount_percent": 0
        },
        "stock_quantity": 16,
        "short_description": "JPT 21V Heavy-Duty Impact Cordless Drill Machine | Max. 90N.M Torque | Max. 0-2000RPM Speed | 10MM Keyless Chuck | 25+3 Gears Setting | 2.0Ah Li-Ion Battery | 24Pcs Drill Accessories",
        "features": [
            "25+3 Position Clutch with 90Nm Torque : The JPT 21-volt cordless drill machine provide 90N.M of maximum torque which ensures a strong and powerful performance for various work while its 25+3 multi-position clutch with 2-speed settings ( 0-650 / 0-2000 rpm ) provides accurate power delivery and optimal control where needed.",
            "LED Light & Ergonomically Design : Our drill machine is designed to be easily to operate and carry, it also features a non-slip rubber sleeve handle design that can be operated with one hand, while giving maximum comfort and minimum fatigue during long work.",
            "2.0Ah Battery & Fast Charger : This cordless drill machine comes with a rechargeable 2000mAh lithium-ion battery which is supported by a high-capacity charger, that will ensures extended usage time without the hassle of frequent battery replacements."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "2800 RPM"
            },
            {
                "key": "Chuck Size",
                "value": "10 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic",
            "weight": "2.5 kg",
            "country_of_origin": "India"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/616QbI+I5LL._SL1080_.jpg",
                "https://m.media-amazon.com/images/I/71TRMhDWRmL._SL1080_.jpg",
                "https://m.media-amazon.com/images/I/61cu6hcoAVL._SL1080_.jpg",
                "https://m.media-amazon.com/images/I/61EhPQ8+FfL._SL1080_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/JPT-Heavy-Duty-Cordless-0-2000RPM-Accessories/dp/B0CW66H3S3/ref=bmx_dp_d_sccl_1_5/523-9897852-6127730?pd_rd_w=oC4Xg&content-id=amzn1.sym.a5646ec7-a2de-49f1-8d39-15f8f2eef501&pf_rd_p=a5646ec7-a2de-49f1-8d39-15f8f2eef501&pf_rd_r=GMK47YE5S4BA83DYKW3R&pd_rd_wg=rs4j3&pd_rd_r=1a95b180-977d-4913-8fc3-01cf3bfda27f&pd_rd_i=B0CW66H3S3&th=1",
        "updated_at": "2026-07-03T02:33:12.158Z",
        "created_at": "2026-07-03T02:33:12.159Z"
    },
    {
        "product_serial_id": 9,
        "sku": "BM-PT-AG-0001",
        "category": "Power Tools",
        "subcategory": "Angle Grinders",
        "name": "BOSCH Professional GWS 600 Angle Grinder",
        "brand": {
            "display": "Bosch",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3272,
            "selling_price": 2181,
            "discount_percent": 33.34
        },
        "stock_quantity": 15,
        "short_description": "Power Source\tCorded Electric\nVoltage\t230 Volts (AC)\nWattage\t660 Watts\nMaximum Rotational Speed\t12000 RPM\nHorsepower\t600 Watts",
        "features": [
            "Powerful Machine Design: BOSCH Professional GWS 600 Angle Grinder is equipped with a strong motor and a sleek, lightweight design to promote comfortable working. Its durable construction ensures long-lasting performance, making it ideal for professional applications.",
            "Technical Specifications: The GWS 600 Angle Grinder can be used with 100 mm disc diameter and has a no-load speed of 11,000 RPM, making it suitable for various tasks. It is equipped with an M10 spindle thread for compatibility with different attachments. With superior airflow and cooling, this tool maintains optimal performance during extended use. Weighing just 1.5 kg, it combines lightweight portability with durability, ensuring ease of maneuverability for any task.",
            "Powerful and User-Friendly: Featuring a 2-position detachable side handle and an all-metal gearbox, this machine ensures durability and improved control during use. Key features include a spindle lock for quick accessory changes, a lock-on switch for continuous operation, and replaceable carbon brushes for easier maintenance."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "230 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "660 W"
            },
            {
                "key": "RPM",
                "value": "11000 RPM"
            },
            {
                "key": "Disc Size",
                "value": "100 mm"
            },
            {
                "key": "Horsepower",
                "value": "600 W"
            },
            {
                "key": "Brand",
                "value": "Bosch"
            },
            {
                "key": "Material",
                "value": "Brass"
            },
            {
                "key": "Product Dimensions",
                "value": "31L x 12W x 9.2H cm"
            },
            {
                "key": "Style",
                "value": "GWS 600"
            }
        ],
        "additional_info": {
            "material": "Brass",
            "weight": "1.8 kg",
            "country_of_origin": "India"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61TK8KolZ6L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71myO2CTghL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71hIU8mi5IL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71JtNo7R4hL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Bosch-GWS-600-Professional-Grinder/dp/B01K4Q3Q9G/ref=sr_1_1_sspa?crid=2TZMXSIWI9RQM&dib=eyJ2IjoiMSJ9.HXIZ9Yv5BWidfQwPw3fOzl2O7XoJAGsV-fTkVYwL-Uhn2i0aqEEMXUDPtSWPE99UqkHF8p-74jP8MPS3eXw42-NeEcAhrpDQ8S-afZb2qmJjkioqmwgNoYOeGSlyzTfZBCsvP-5L3fpg9EBQGtWndAr8EnKBs-ak4VaUd756h-yyc5UroiYfRWnENWj5Ic17V_f99IJ_GANcS6inw1oyaTmqiYoIsaBPtXKIbm0_42DFkDHvJrXmIrnpeaB3F_p9w5fNmORSCtSFJSu6grADiXFwlJTz5brBuPHIOukBFmo.4O2SYCowExvoL28rSmxGaM6VHF9SRDVwBOZVaxaJ0vA&dib_tag=se&keywords=angle%2Bgrinder%2Bmachine&qid=1783075078&sprefix=angle%2B%2Caps%2C554&sr=8-1-spons&aref=b7gOsmi8md&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
        "updated_at": "2026-07-03T10:42:55.368Z",
        "created_at": "2026-07-03T10:42:55.368Z"
    },
    {
        "product_serial_id": 10,
        "sku": "BM-PT-AG-0002",
        "category": "Power Tools",
        "subcategory": "Angle Grinders",
        "name": "IBELL TOOLS Angle Grinder AG10-92",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3794,
            "selling_price": 2529,
            "discount_percent": 33.34
        },
        "stock_quantity": 19,
        "short_description": "IBELL TOOLS Angle Grinder AG10-92, 850W, Copper Armature, Disc dia 100mm, 11000 RPM with Grinding Wheel and Guard, 6 Months Warranty",
        "features": [
            "Disc diameter 100 millimeter; no load speed 11000rpm; spindle thread M10; overall length: 340 millimeter",
            "It is a 2 position side handle all-metal gearbox fan-cooled motor spindle lock; lock on switch; replaceable carbon brushes; supplied with guard",
            "Warranty - 6 months from the date of Invoice"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "230 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "850 W"
            },
            {
                "key": "RPM",
                "value": "11000 RPM"
            },
            {
                "key": "Disc Size",
                "value": "100 mm"
            },
            {
                "key": "Brand",
                "value": "IBELL"
            },
            {
                "key": "Material",
                "value": "Metal, Plastic"
            },
            {
                "key": "Product Dimensions",
                "value": "35L x 13W x 10H cm"
            },
            {
                "key": "Style",
                "value": "Angle Grinder"
            },
            {
                "key": "Horsepower",
                "value": "850 W"
            },
            {
                "key": "Style Name",
                "value": "Angle Grinder"
            },
            {
                "key": "Colour",
                "value": "RED"
            }
        ],
        "additional_info": {
            "material": "Metal + Plastic",
            "weight": "1.74 kg",
            "country_of_origin": "India"
        },
        "warranty_period": "6 Months",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/51vETdfc+3L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/614pmKizmoL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/51nOMPbRZPL._SL1455_.jpg",
                "https://m.media-amazon.com/images/I/715XksUQ33L._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/IBELL-TOOLS-Grinder-Armature-Grinding/dp/B07NDDMF17/ref=sr_1_4_sspa?crid=2TZMXSIWI9RQM&dib=eyJ2IjoiMSJ9.HXIZ9Yv5BWidfQwPw3fOzl2O7XoJAGsV-fTkVYwL-Uhn2i0aqEEMXUDPtSWPE99UqkHF8p-74jP8MPS3eXw42-NeEcAhrpDQ8S-afZb2qmJjkioqmwgNoYOeGSlyzTfZBCsvP-5L3fpg9EBQGtWndAr8EnKBs-ak4VaUd756h-yyc5UroiYfRWnENWj5Ic17V_f99IJ_GANcS6inw1oyaTmqiYoIsaBPtXKIbm0_42DFkDHvJrXmIrnpeaB3F_p9w5fNmORSCtSFJSu6grADiXFwlJTz5brBuPHIOukBFmo.4O2SYCowExvoL28rSmxGaM6VHF9SRDVwBOZVaxaJ0vA&dib_tag=se&keywords=angle+grinder+machine&qid=1783075078&sprefix=angle+%2Caps%2C554&sr=8-4-spons&aref=GhgVHy1hax&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
        "updated_at": "2026-07-03T10:48:04.286Z",
        "created_at": "2026-07-03T10:48:04.286Z"
    },
    {
        "product_serial_id": 12,
        "sku": "BM-PT-AG-0003",
        "category": "Power Tools",
        "subcategory": "Angle Grinders",
        "name": "DEWALT DWE750T-IN",
        "brand": {
            "display": "DEWALT",
            "normalized": "dewalt"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3749,
            "selling_price": 2499,
            "discount_percent": 33.34
        },
        "stock_quantity": 31,
        "short_description": "DEWALT DWE750T-IN,750Watt, 4\" (100mm) Ultra SLIM Heavy Duty Angle Grinder Engineered For Heavy Duty Applications with Spindle Lock and Toggle Switch, 2 Year Manufacturer Warranty(SIDE HANDLE INCLUDED)",
        "features": [
            "EWALT DWE750T-IN is ideal for weld head removal, paint removal, sheet cutting and rust removal.",
            "Ultra Slim 173mm girth size with 1.6kg light-weight design for effortless prolonged usage.",
            "Durable and powerful 750W Motor for excellent grinding-cutting performance."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "750 W"
            },
            {
                "key": "RPM",
                "value": "2800 RPM"
            },
            {
                "key": "Disc Size",
                "value": "100 mm"
            }
        ],
        "additional_info": {
            "material": "Metal",
            "weight": "1.6 kg",
            "country_of_origin": "India"
        },
        "warranty_period": "2 Years",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/61XTsr+5eRL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81Yu65WrrIL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61GKRx3q6dL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71tJMjd19nL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/s?k=angle+grinder+machine&crid=2TZMXSIWI9RQM&sprefix=angle+%2Caps%2C554&ref=nb_sb_ss_mvt-t11-ranker_2_6",
        "updated_at": "2026-07-03T10:55:10.132Z",
        "created_at": "2026-07-03T10:55:10.133Z"
    },
    {
        "product_serial_id": 13,
        "sku": "BM-PT-AG-0004",
        "category": "Power Tools",
        "subcategory": "Angle Grinders",
        "name": "iBELL IBL AG10-06 Heavy Duty Angle Grinder ",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3450,
            "selling_price": 2402,
            "discount_percent": 30.38
        },
        "stock_quantity": 12,
        "short_description": "iBELL IBL AG10-06 Heavy Duty Angle Grinder | 1100W Motor | Variable Speed | 100mm Disc | Up to 11,000 RPM | Versatile Cutting and Grinding Tool | M10 Grinding Spindle Thread | 6 Months Warranty",
        "features": [
            "Powerful 1100W Motor: Delivers consistent power for heavy-duty cutting, grinding, polishing, and surface preparation.",
            "Variable Speed Control: Adjustable speed up to 11,000 RPM for precision work on metal, stone, wood, tiles, and concrete.",
            "Unique Slim Shape & Ergonomic Grip: Specially designed body shape with a comfortable slim grip ensures better handling, balance, and reduced fatigue during prolonged use.",
            "Durable Build with M10 Spindle Thread: Heavy-duty housing and M10 spindle support standard 100mm discs for long-lasting reliability."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "‎230 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "‎1100 W"
            },
            {
                "key": "RPM",
                "value": "‎11000 RPM"
            },
            {
                "key": "Disc Size",
                "value": "100 mm"
            },
            {
                "key": "Brand",
                "value": "‎IBELL"
            },
            {
                "key": "Manufacturer",
                "value": "‎TSP TECHNOLOGIES , NINGBO ,ZHEJIANG"
            },
            {
                "key": "Country of Origin",
                "value": "‎China"
            },
            {
                "key": "Model number",
                "value": "‎IBLAG10-06"
            },
            {
                "key": "Colour",
                "value": "‎DARK RED"
            },
            {
                "key": "Item Weight",
                "value": "‎2 kg 340 g"
            },
            {
                "key": "Product Dimensions",
                "value": "‎39 x 12 x 11"
            },
            {
                "key": "Item model number",
                "value": "‎IBLAG10-06"
            },
            {
                "key": "Item Height",
                "value": "‎11 cm"
            },
            {
                "key": "Item Width",
                "value": "‎12 cm"
            },
            {
                "key": "Included Components",
                "value": "‎Machine"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "2.3 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "Machine"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71X7xqDACnL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81vLzrpiqQL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/715pCC7f7oL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71gePl-TN-L._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/iBELL-Grinder-AG10-06-Months-Warranty/dp/B0CZDHC3ZY/ref=sr_1_12?crid=2TZMXSIWI9RQM&dib=eyJ2IjoiMSJ9.HXIZ9Yv5BWidfQwPw3fOzl2O7XoJAGsV-fTkVYwL-Uhn2i0aqEEMXUDPtSWPE99UqkHF8p-74jP8MPS3eXw42-NeEcAhrpDQ8S-afZb2qmJjkioqmwgNoYOeGSlyzTfZBCsvP-5L3fpg9EBQGtWndAr8EnKBs-ak4VaUd756h-yyc5UroiYfRWnENWj5Ic17V_f99IJ_GANcS6inw1oyaTmqiYoIsaBPtXKIbm0_42DFkDHvJrXmIrnpeaB3F_p9w5fNmORSCtSFJSu6grADiXFwlJTz5brBuPHIOukBFmo.4O2SYCowExvoL28rSmxGaM6VHF9SRDVwBOZVaxaJ0vA&dib_tag=se&keywords=angle+grinder+machine&qid=1783075078&sprefix=angle+%2Caps%2C554&sr=8-12",
        "updated_at": "2026-07-03T11:01:02.901Z",
        "created_at": "2026-07-03T11:01:02.901Z"
    },
    {
        "product_serial_id": 14,
        "sku": "BM-PT-AG-0005",
        "category": "Power Tools",
        "subcategory": "Angle Grinders",
        "name": "IBELL VORMIR Angle Grinder VR AG10-06 ",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 3450,
            "selling_price": 2366,
            "discount_percent": 31.42
        },
        "stock_quantity": 7,
        "short_description": "IBELL VORMIR Angle Grinder VR AG10-06 | 1100W Heavy Duty | Copper Armature | 100mm/4\" Disc Dia | 0–11000 RPM | With Grinding Wheel & Guard | 12 Months Warranty",
        "features": [
            "Specifications – VORMIR VR AG10-06 Angle Grinder | 1100W | 220–230V~50/60Hz | 0–11000 RPM | 100mm DISK",
            "Heavy-Duty 1100W Motor – High-performance copper armature motor built for powerful grinding, cutting, and polishing tasks 100mm Disc with 11000 RPM Speed – Ideal for smooth and precise operation on metal, tiles, stone, and concrete surfaces Ready to Use – Comes with a grinding wheel and safety guard included in the box for immediate operation and user protection Ergonomic & Lightweight Design – Side handle and 1.82 Kg weight ensure comfortable grip and control for extended usage",
            "100mm Disc with 11000 RPM Speed – Ideal for smooth and precise operation on metal, tiles, stone, and concrete surfaces"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "230 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "1100 W"
            },
            {
                "key": "RPM",
                "value": "11000 RPM"
            },
            {
                "key": "Disc Size",
                "value": "100 mm"
            },
            {
                "key": "Horsepower",
                "value": "1.48 Horsepower"
            },
            {
                "key": "Item Dimensions L x W x H",
                "value": "12L x 11W x 39H cm"
            },
            {
                "key": "Item Weight",
                "value": "2.39 Kilograms"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "2.39 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71WOeMmSJ2L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71lCP755QHL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/811lxGbO3FL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81GIlCWuT9L._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/dp/B0FH551F39/ref=sspa_dk_detail_4?psc=1&pd_rd_i=B0FH551F39&pd_rd_w=VA81M&content-id=amzn1.sym.9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_p=9a67d0ba-b3d8-41ee-8e29-a3d839054b56&pf_rd_r=SXSE5QPPD4RM09YK0GE0&pd_rd_wg=5lMk0&pd_rd_r=3197a4a1-eb1d-4556-8025-0c4ce4a7a1e7&aref=xM95OhKQGv&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy",
        "updated_at": "2026-07-03T11:06:36.039Z",
        "created_at": "2026-07-03T11:06:36.039Z"
    },
    {
        "product_serial_id": 15,
        "sku": "BM-PT-AG-0006",
        "category": "Power Tools",
        "subcategory": "Angle Grinders",
        "name": "WINTECH Angle Grinder WT AG10-75",
        "brand": {
            "display": "WINTECH",
            "normalized": "wintech"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 2500,
            "selling_price": 1566,
            "discount_percent": 37.36
        },
        "stock_quantity": 6,
        "short_description": "Angle Grinder WT AG10-75 | 750W Power | 100mm/4\" Disc | M10 Spindle Thread | Powerful Cutting, Grinding & Polishing Tool | Ergonomic Design| Ideal for Home, Workshop & DIY",
        "features": [
            "Powerful 750W Motor – Delivers strong and consistent power for heavy-duty cutting, grinding, and polishing tasks.",
            "High-Speed Performance (11000 RPM) – Ensures fast material removal and smooth surface finishing"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "11000 RPM"
            },
            {
                "key": "Disc Size",
                "value": "100 mm"
            },
            {
                "key": "Manufacturer",
                "value": "TSP TECHNOLOGIES , NINGBO , ZHEJIANG"
            },
            {
                "key": "Packer",
                "value": "HITECH MACHINERIES, RHM Technologies , Ningbo , Zhejiang , PRC"
            },
            {
                "key": "Importer",
                "value": "HITECH MACHINERIES, RHM Technologies , Ningbo , Zhejiang , PRC"
            },
            {
                "key": "Item Weight",
                "value": "2 kg"
            },
            {
                "key": "Item Dimensions LxWxH",
                "value": "30 x 11.5 x 11 cm"
            },
            {
                "key": "Net Quantity",
                "value": "1 Count"
            },
            {
                "key": "Included Components",
                "value": "ANGLE GRINDER, GRINDING WHEEL , WHEEL GUARD, WRENCH"
            },
            {
                "key": "Generic Name",
                "value": "ANGLE GRINDER"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "2 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71EsHcmwZpL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81txfTxhhsL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81jwQh7qOjL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/91jW1TSad8L._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/WINTECH-PRO-WT-AG10-75-Polishing/dp/B0FQ26KMM9/ref=sr_1_14?crid=2NC1K9C0MYN6M&dib=eyJ2IjoiMSJ9.HXIZ9Yv5BWidfQwPw3fOzib6HIt3bPAgssaGlzL2X1yK0OvrnTjDimEEgBJT6RY1OeTBLhmtfss5u9KxeWPn2yyQMedBrKZi-dpPQP7uQe9mjoc5o7ea5HdZ3gAV8EmsQrf36anfyzC-LDI0hOarvfuvxi5PJUz6Nq4iB0gZ064YoKo0yFEDNLEjEvvBP6WkRUw5MHX19KV5SUoILgM7S2CLnmdLJen1-QPGNyUlzvwhwhxUoMv83w2gKPlnInsOBCkcj82THl2vDpxsRnPldl_Vp1WLhLeD_9XbSVfW75Q.etSents2oVdCBdf4DGqSv6n00KJ6N95YIFbSMCwAllI&dib_tag=se&keywords=angle%2Bgrinder%2Bmachine%2Bheavy%2Bduty&qid=1783076861&sprefix=QNGLE%2Bgrinder%2Bmachine%2B%2Caps%2C313&sr=8-14&th=1",
        "updated_at": "2026-07-03T11:14:01.582Z",
        "created_at": "2026-07-03T11:14:01.583Z"
    },
    {
        "product_serial_id": 16,
        "sku": "BM-PT-CS-0001",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "INGCO Circular Saw TC-9",
        "brand": {
            "display": "INGCO",
            "normalized": "ingco"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 5500,
            "selling_price": 4899,
            "discount_percent": 10.93
        },
        "stock_quantity": 12,
        "short_description": "INGCO Circular Saw, 1400W | 4800rpm Electric Saw, Adjustable Cutting Depth/Bevel Cutting Corded Saw with 185mm Blade for Home Decoration or Woodworking",
        "features": [
            "Powerful 1400W motor produces up to 4800RPM – powerful enough for a professional. Heat resistant copper wire motor allows long working time without burning the machine. The high-performance electric circular saw helps to increase your efficiency.",
            "0-45 degree bevel capacity allows for aggressive bevel cuts for a multitude of applications. Max cutting depth to 65mm; 44mm at 45 degree",
            "Cutting Guide Ruler makes accurate cuts； Spindle lock allows for quick and easy blade changes; Light design helps keep you comfortable and in control while minimizing muscle fatigue; Corded design offers unlimited runtime for even the biggest jobs."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "28 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "1400 W"
            },
            {
                "key": "RPM",
                "value": "4800 RPM"
            },
            {
                "key": "Other Special Features of the Product",
                "value": "Attribute not aplicable for product"
            },
            {
                "key": "Number of Teeth",
                "value": "24"
            },
            {
                "key": "Cutting Angle",
                "value": "45 Degrees"
            },
            {
                "key": "Blade Shape",
                "value": "Round"
            },
            {
                "key": "Item Dimensions L x W x H",
                "value": "26L x 19W x 33H cm"
            },
            {
                "key": "Item Weight",
                "value": "350 g"
            },
            {
                "key": "Blade Length",
                "value": "185 mm"
            },
            {
                "key": "Colour",
                "value": "Yellow"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "2 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71S7LKHpe2L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71CevBfO5WL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71FiiIcVR3L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71WYECab+lL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71e6kQnPziL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/A1zR5P4T6OL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Circular-Electric-Adjustable-Decoration-Woodworking/dp/B09VNZ4QHC/ref=sr_1_6?dib=eyJ2IjoiMSJ9.-32G_E7v1rNZVbCnVUhzyMTP9J4Fg8x254dMOdYEhP1BOb4n_Q3JkXXOc03achGXtd1UzFxyhYT0UnhdFiS5S9brUmByhBuHiLjY2MLACiqVF7q_WZAoJOE6UVycV4ErmhNmPQD5IiK_y35Zb9BEEtrSz1n0080h4O7Ie9_aez10S2lHmS0vCComsbGB9kAPlW9IQ7cQmqpbXBmtuV8LtSQqsQECl4cCHUvwArgUCGIMfg8q0j26j2TFnYuYDxUKKW0ynMeAQ5xA5pZLADUHC2WTsuuUVZMB1UrAP00geX8.VmAzqsmkmwa7pB3NAf8LmxGOt1d2W8WmrhjrL-EYnrg&dib_tag=se&keywords=circular%2Bsaw%2Bwood&qid=1783077503&sr=8-6&th=1",
        "updated_at": "2026-07-03T11:23:04.331Z",
        "created_at": "2026-07-03T11:23:04.331Z"
    },
    {
        "product_serial_id": 17,
        "sku": "BM-PT-CS-0002",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "IBELL Circular Saw CS85-71",
        "brand": {
            "display": "IBELL",
            "normalized": "ibell"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 8500,
            "selling_price": 5015,
            "discount_percent": 41
        },
        "stock_quantity": 15,
        "short_description": "IBELL Circular Saw CS85-71 |1400W 185mm Blade, 4800 RPM High-Speed Cutter with Copper Armature Motor, 58mm Cutting Depth, Bevel Cuts up to 45°| For Wood, Marble & Concrete | 6-Month Warranty",
        "features": [
            "Rated voltage : 230V~50Hz; Rated Input Power : 1400 W; Rated no load speed : 4800 rpm; Cutting wheel diameter : 185mm~7.2”; Maximum Cutting Depth : 58 mm; Weight : 5.3 Kg",
            "CS85-71 is a circular power-saw using a toothed blade to cut materials using a rotary motion spinning around an arbor. This can be used for cutting materials such as wood, masonry, plastic, sometimes light metal.",
            "This is a powerful and compact tool for cutting that works quite precisely and fast. The cutting wheel(blade) has a position that gives the best reach to the workpiece and improves the efficiency of cutting. The blade is spindle mounted so we can fix and remove it quickly."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "4800 RPM"
            },
            {
                "key": "Manufacturer",
                "value": "HiTECH Machineries & Equipments H&K Edifice, IV/540 Thottumughom, Aluva-683105, Cochin, India, Toll Free 18001034090, TSP TECHNOLOGIES , NINGBO ,ZHEJIANG"
            },
            {
                "key": "Country of Origin",
                "value": "‎China"
            },
            {
                "key": "Item model number",
                "value": "‎CS85-71"
            },
            {
                "key": "Product Dimensions",
                "value": "‎30 x 30 x 30 cm; 5.3 kg"
            },
            {
                "key": "ASIN",
                "value": "‎B09FGV5F2S"
            },
            {
                "key": "Packer",
                "value": "HiTECH Machineries & Equipments, H&K Edifice, IV/540 Thottumughom, Aluva-683105, Cochin, India, Toll Free 18001034090"
            },
            {
                "key": "Importer",
                "value": "HITECH MACHINERIES AND EQUIPMENTS"
            },
            {
                "key": "Item Weight",
                "value": "5 kg 300 g"
            },
            {
                "key": "Item Dimensions LxWxH",
                "value": "30 x 30 x 30 cm"
            },
            {
                "key": "Net Quantity",
                "value": "1.00 Count"
            },
            {
                "key": "Included Components",
                "value": "Case"
            },
            {
                "key": "Generic Name",
                "value": "Circular Saw"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "5 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "6 Months",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71SamlOH+EL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81dywpbQKmL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81xlsCVE-aL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61Fiz0VCm7L._SL1024_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/IBELL-CS85-71-1400W-4800RPM-Circular/dp/B09FGV5F2S/ref=sr_1_7?dib=eyJ2IjoiMSJ9.-32G_E7v1rNZVbCnVUhzyMTP9J4Fg8x254dMOdYEhP1BOb4n_Q3JkXXOc03achGXtd1UzFxyhYT0UnhdFiS5S9brUmByhBuHiLjY2MLACiqVF7q_WZAoJOE6UVycV4ErmhNmPQD5IiK_y35Zb9BEEtrSz1n0080h4O7Ie9_aez10S2lHmS0vCComsbGB9kAPlW9IQ7cQmqpbXBmtuV8LtSQqsQECl4cCHUvwArgUCGIMfg8q0j26j2TFnYuYDxUKKW0ynMeAQ5xA5pZLADUHC2WTsuuUVZMB1UrAP00geX8.VmAzqsmkmwa7pB3NAf8LmxGOt1d2W8WmrhjrL-EYnrg&dib_tag=se&keywords=circular%2Bsaw%2Bwood&qid=1783077503&sr=8-7&th=1",
        "updated_at": "2026-07-03T11:28:56.971Z",
        "created_at": "2026-07-03T11:28:56.971Z"
    },
    {
        "product_serial_id": 19,
        "sku": "BM-PT-CS-0003",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "Bosch GKS 235 Turbo Heavy Duty Electric Circular Saw",
        "brand": {
            "display": "Bosch",
            "normalized": "bosch"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 20400,
            "selling_price": 13600,
            "discount_percent": 33.33
        },
        "stock_quantity": 9,
        "short_description": "\nClick to see full view\n\n\nVIDEO\n\n\n\n\nBosch GKS 235 Turbo Heavy Duty Electric Circular Saw, 2,050W, 235 mm Blade Dia.,5,300 rpm, 25 mm Bore, Air Blower, Bosch Click & Clean System, 7.6 kg + Key, Wrench, Saw Blades, 1 Year",
        "features": [
            "Ergonomic design for user-friendly operation",
            "Magic grommet user-friendly and magic design on grommet connecting to power cord, for freely 360 degree turning around",
            "Dust extraction hole for effective dust",
            "management Strong turbo blower gives a clear view of cutting on work piece for precision"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "240 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "2050 W"
            },
            {
                "key": "RPM",
                "value": "5500 RPM"
            },
            {
                "key": "Other Special Features of the Product",
                "value": "Dishwasher Safe"
            },
            {
                "key": "Number of Teeth",
                "value": "80"
            },
            {
                "key": "Cutting Angle",
                "value": "90 Degrees"
            },
            {
                "key": "Blade Shape",
                "value": "Round"
            },
            {
                "key": "Item Dimensions L x W x H",
                "value": "16.1L x 8.3W x 9.4H cm"
            },
            {
                "key": "Item Weight",
                "value": "9520 g"
            },
            {
                "key": "Blade Length",
                "value": "9 Inches"
            },
            {
                "key": "Blade Material",
                "value": "Alloy Steel"
            },
            {
                "key": "Handle Material",
                "value": "Plastic"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Alloy Steel",
            "weight": "7.6 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71MNoig4BJL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71AduHwg3mL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81E6DrgzQfL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71X2Tk-CyaL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/81sgO6r3T7L._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Bosch-GKS-Turbo-Circular-2050W/dp/B019H48NFS/ref=sxin_14_pa_sp_search_thematic_sspa?content-id=amzn1.sym.f7d72a1e-5698-491d-8e4e-cca77b240640%3Aamzn1.sym.f7d72a1e-5698-491d-8e4e-cca77b240640&cv_ct_cx=circular%2Bsaw%2Bwood&keywords=circular%2Bsaw%2Bwood&pd_rd_i=B019H48NFS&pd_rd_r=60df3333-fedf-40a8-85ba-0a7cae0abb9b&pd_rd_w=FWtOj&pd_rd_wg=ZJpFX&pf_rd_p=f7d72a1e-5698-491d-8e4e-cca77b240640&pf_rd_r=1KCYYATA89EKHGNGTY2P&qid=1783077503&sbo=9ZOMT9Jm0JH%2Ft%2BWi68iDSA%3D%3D&sr=1-2-66673dcf-083f-43ba-b782-d4a436cc5cfb-spons&aref=tg55AfbPhO&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&th=1",
        "updated_at": "2026-07-03T11:35:21.552Z",
        "created_at": "2026-07-03T11:35:21.552Z"
    },
    {
        "product_serial_id": 20,
        "sku": "BM-PT-CS-0004",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "INGCO 20V Cordless Brushless Circular Saw",
        "brand": {
            "display": "INGCO",
            "normalized": "ingco"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 12000,
            "selling_price": 8000,
            "discount_percent": 33.33
        },
        "stock_quantity": 8,
        "short_description": "INGCO 20V Cordless Brushless Circular Saw 140mm(5-1/2''), 6300RPM, Max. Cutting Depth 50mm (90°), 20mm Arbor Size, Adjustable Bevel, Electric Circular Saw with 1Pcs 4.0Ah Battery and Charger ",
        "features": [
            "INGCO circular saw uses a brushless motor that eliminates the need to replace carbon brushes. Powerful Brushless motor produces up to 6300RPM – powerful enough for a professional.",
            "0-45 degree bevel capacity allows for aggressive bevel cuts for a multitude of applications. Customize the cutting depth to 50mm at 90 degrees; 33mm at 45 degree.",
            "Cutting Guide Ruler makes accurate cuts； Spindle lock allows for quick and easy blade changes; Light design helps keep you comfortable and in control while minimizing muscle fatigue; Cordless design offers unlimited line for even the outdoor jobs."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Cordless / Battery"
            },
            {
                "key": "Voltage",
                "value": "20 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "6300 RPM"
            },
            {
                "key": "Brand",
                "value": "Ingco"
            },
            {
                "key": "Amperage",
                "value": "15 A"
            },
            {
                "key": "Chuck Size",
                "value": "20 mm"
            },
            {
                "key": "Colour",
                "value": "Multicolour"
            },
            {
                "key": "Included Components",
                "value": "1x circular saw, 1x 4.0ah battery, 1x charger, 1x 140mm saw blade"
            },
            {
                "key": "Special Feature",
                "value": "Brushless Motor, Portable"
            },
            {
                "key": "Product Dimensions",
                "value": "38L x 15W x 23.3H cm"
            },
            {
                "key": "Additional Features",
                "value": "Brushless Motor, Portable"
            },
            {
                "key": "Drill Type",
                "value": "Basic Drill"
            },
            {
                "key": "Battery Capacity",
                "value": "4 A Hours"
            },
            {
                "key": "Is Electric",
                "value": "Yes"
            },
            {
                "key": "Drilling Capacity Wood",
                "value": "5.5 Inches"
            },
            {
                "key": "Brand Name",
                "value": "Ingco"
            },
            {
                "key": "Model Number",
                "value": "CSLI14021"
            },
            {
                "key": "Manufacturer",
                "value": "Ingco"
            },
            {
                "key": "Manufacturer Warranty Description",
                "value": "6 months"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "7.6 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "6 Months",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/81Uvz4mhBcL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71A6YssF8IL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71JzupHeL5L._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/91WTsjH2WcL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Cordless-Circular-Brushless-Adjustable-Cutting/dp/B0D83QHXKP/ref=sr_1_17?dib=eyJ2IjoiMSJ9.-32G_E7v1rNZVbCnVUhzyMTP9J4Fg8x254dMOdYEhP1BOb4n_Q3JkXXOc03achGXtd1UzFxyhYT0UnhdFiS5S9brUmByhBuHiLjY2MLACiqVF7q_WZAoJOE6UVycV4ErmhNmPQD5IiK_y35Zb9BEEtrSz1n0080h4O7Ie9_aez10S2lHmS0vCComsbGB9kAPlW9IQ7cQmqpbXBmtuV8LtSQqsQECl4cCHUvwArgUCGIMfg8q0j26j2TFnYuYDxUKKW0ynMeAQ5xA5pZLADUHC2WTsuuUVZMB1UrAP00geX8.VmAzqsmkmwa7pB3NAf8LmxGOt1d2W8WmrhjrL-EYnrg&dib_tag=se&keywords=circular+saw+wood&qid=1783077503&sr=8-17",
        "updated_at": "2026-07-03T11:41:54.864Z",
        "created_at": "2026-07-03T11:41:54.864Z"
    },
    {
        "product_serial_id": 21,
        "sku": "BM-PT-CS-0005",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "JCB Professional 7 Inch Circular Saw ",
        "brand": {
            "display": "JCB",
            "normalized": "jcb"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 8400,
            "selling_price": 5600,
            "discount_percent": 33.33
        },
        "stock_quantity": 16,
        "short_description": "JCB Professional 7 Inch Circular Saw 1500W | Adjustable Base Plate & Spindle Lock | 7 inch Wood Cutting machine Heavy Duty | 1500W & 5000 RPM Circular Saw 7 ",
        "features": [
            "PACKAGE CONTENTS: 1 pc Circular Saw, 1 pc Depth Gauge, 1 pc Safety Nut Opener, 1 pc Wood Cutting Blade, 1 pc Instruction Manual, and 1 pc warranty certificate",
            "POWERFUL & DURABLE: The 1500W motor delivers optimum power transmission for superior performance even in the toughest of applications.",
            "ERGONOMIC & SAFE: Spindle lock helps quick changing of saw blades while Ergonomic grip and handle increases user comfort. Aluminium Die-Cast body and adjustable base plate gives the tool a longer life. CONVENIENT: Can be operated with a 45° bevel via base plate.",
            "Comes with an infinitely Variable cutting depth setting and Cutting Capacity of 67mm (90°) & 44mm (45°)."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "‎1500 W"
            },
            {
                "key": "RPM",
                "value": "5000 RPM"
            },
            {
                "key": "Brand",
                "value": "‎Groz"
            },
            {
                "key": "Manufacturer",
                "value": "JCB Tools, JCB Tools"
            },
            {
                "key": "Model number",
                "value": "‎CRS/7/1500/JCB"
            },
            {
                "key": "Colour",
                "value": "‎Yellow"
            },
            {
                "key": "Number of Memory Sticks",
                "value": "‎1"
            },
            {
                "key": "Special Feature",
                "value": "‎Ergonomic"
            },
            {
                "key": "Item Weight",
                "value": "‎5 kg 500 g"
            },
            {
                "key": "Product Dimensions",
                "value": "‎30 x 25 x 15 cm; 5.5 kg"
            },
            {
                "key": "Item model number",
                "value": "‎CRS/7/1500/JCB"
            },
            {
                "key": "Item Height",
                "value": "‎15 cm"
            },
            {
                "key": "Item Width",
                "value": "‎25 cm"
            },
            {
                "key": "Included Components",
                "value": "‎Adapter"
            },
            {
                "key": "Packer",
                "value": "JCB Tools"
            },
            {
                "key": "Item Dimensions LxWxH",
                "value": "30 x 25 x 15 cm"
            },
            {
                "key": "Net Quantity",
                "value": "1 Count"
            },
            {
                "key": "Generic Name",
                "value": "Professional Circular Saw"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "5.5 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/41y4gWrX--L.jpg",
                "https://m.media-amazon.com/images/I/51XivMWVY3L.jpg",
                "https://m.media-amazon.com/images/I/41cTmi1GozL.jpg",
                "https://m.media-amazon.com/images/I/411NINajsBL.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/PROFESSIONAL-Adjustable-remodelers-carpenters-contractors/dp/B09JYPH2VM/ref=sr_1_13?dib=eyJ2IjoiMSJ9.-32G_E7v1rNZVbCnVUhzyMTP9J4Fg8x254dMOdYEhP1BOb4n_Q3JkXXOc03achGXtd1UzFxyhYT0UnhdFiS5S9brUmByhBuHiLjY2MLACiqVF7q_WZAoJOE6UVycV4ErmhNmPQD5IiK_y35Zb9BEEtrSz1n0080h4O7Ie9_aez10S2lHmS0vCComsbGB9kAPlW9IQ7cQmqpbXBmtuV8LtSQqsQECl4cCHUvwArgUCGIMfg8q0j26j2TFnYuYDxUKKW0ynMeAQ5xA5pZLADUHC2WTsuuUVZMB1UrAP00geX8.VmAzqsmkmwa7pB3NAf8LmxGOt1d2W8WmrhjrL-EYnrg&dib_tag=se&keywords=circular+saw+wood&qid=1783080015&sr=8-13",
        "updated_at": "2026-07-03T12:24:12.874Z",
        "created_at": "2026-07-03T12:24:12.874Z"
    },
    {
        "product_serial_id": 22,
        "sku": "BM-PT-CS-0006",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "BLACK+DECKER CS1500-IN CORDED Electric Saw",
        "brand": {
            "display": "BLACK+DECKER",
            "normalized": "black+decker"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 9000,
            "selling_price": 5999,
            "discount_percent": 33.34
        },
        "stock_quantity": 17,
        "short_description": "BLACK+DECKER CS1500-IN CORDED Electric 7''(185mm) WOOD Cutting Circular Saw | 1500W, 5500 RPM | Comes with 2 x 36T TCT Blades | Ideal for Home, DIY & Professional Use | 1Year Warranty | ORANGE & BLACK",
        "features": [
            "Power: 1500 Watts, Blade Size: 185mm, Speed: 5500 RPM, Depth of Cut at 90 Degree: 62mm, Depth of Cut at 45 Degree: 46mm, Beveling Shoe: 0 - 45 Degree, Cable Length: 2 Meter, For Cutting Wood",
            "No Load Speed: 4300 RPM ; Bevel Cut: 0-45° ; Max Cutting Depth: 63 mm",
            "Ergonomic Handle for Maximum Control and Comfort.",
            "Beveling Shoe for Angled Cuts. 36 Teeth Carbide Blade for fast Cutting"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "1500 W"
            },
            {
                "key": "RPM",
                "value": "5500 RPM"
            },
            {
                "key": "Brand",
                "value": "BLACK+DECKER"
            },
            {
                "key": "Colour",
                "value": "Orange, Black"
            },
            {
                "key": "Blade Material",
                "value": "Tungsten Carbide"
            },
            {
                "key": "Surface Recommendation",
                "value": "Wood"
            },
            {
                "key": "Special Feature",
                "value": "Ergonomic"
            },
            {
                "key": "Number of Teeth",
                "value": "36"
            },
            {
                "key": "Cutting Angle",
                "value": "45 Degrees"
            },
            {
                "key": "Blade Shape",
                "value": "Round"
            },
            {
                "key": "Item Dimensions L x W x H",
                "value": "10L x 10W x 11H cm"
            },
            {
                "key": "Blade Length",
                "value": "185 mm"
            },
            {
                "key": "Brand Name",
                "value": "BLACK+DECKER"
            },
            {
                "key": "Included Components",
                "value": "2x 36 Teeth Carbide Saw Blade Wrench And Parallel Guide"
            },
            {
                "key": "Model Number",
                "value": "CS1500-IN"
            },
            {
                "key": "Manufacturer Warranty Description",
                "value": "1 year warranty provided by the manufacturer from date of purchase"
            },
            {
                "key": "Manufacturer Part Number",
                "value": "CV-LS4U-7438"
            },
            {
                "key": "Packer Contact Information",
                "value": "Tools Centre"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "7.6 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "2x 36 Teeth Carbide Saw Blade Wrench And Parallel Guide"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/711VNoC3HOL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61pjVqHAP1L.jpg",
                "https://m.media-amazon.com/images/I/81JJRwIeDDL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/611qrM0MafL.jpg",
                "https://m.media-amazon.com/images/I/41MEUhLhc3L.jpg",
                "https://m.media-amazon.com/images/I/71Bbyo9EkWL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/814bu6RjWYL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Black-Decker-CS1500-Cutting-Circular/dp/B007MZEIY0/ref=dp_fod_d_sccl_2/523-9897852-6127730?pd_rd_w=vcduq&content-id=amzn1.sym.b22639fc-0e89-4e4a-a009-345b4692f10f&pf_rd_p=b22639fc-0e89-4e4a-a009-345b4692f10f&pf_rd_r=33DP7G3S10HY6HHBK3VT&pd_rd_wg=xm8ll&pd_rd_r=811a109b-5afe-4a03-86ff-0a4d9943dbdc&pd_rd_i=B007MZEIY0&th=1",
        "updated_at": "2026-07-03T12:34:43.413Z",
        "created_at": "2026-07-03T12:34:43.413Z"
    },
    {
        "product_serial_id": 24,
        "sku": "BM-PT-CS-0007",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "Makita HS7600 Powerful",
        "brand": {
            "display": "Makita",
            "normalized": "makita"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 18593,
            "selling_price": 12395,
            "discount_percent": 33.34
        },
        "stock_quantity": 18,
        "short_description": "Makita HS7600 Powerful 1,200 Watt 185 mm Blade Diameter Circular Saw With Single Action Lever For Quick Adjustment Of Cutting Depth",
        "features": [
            "Includes TCT Saw Blade, Rip Fence Guide Rule and Hex Wrench. 6 Months Warranty Against Manufacturing Defects."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "1200 W"
            },
            {
                "key": "RPM",
                "value": "5200 RPM"
            },
            {
                "key": "Other Special Features of the Product",
                "value": "Ergonomic"
            },
            {
                "key": "Number of Teeth",
                "value": "24"
            },
            {
                "key": "Cutting Angle",
                "value": "90 Degrees"
            },
            {
                "key": "Blade Shape",
                "value": "Round"
            },
            {
                "key": "Brand Name",
                "value": "Makita"
            },
            {
                "key": "Included Components",
                "value": "HS7600"
            },
            {
                "key": "Model Number",
                "value": "HS7600"
            },
            {
                "key": "UPC",
                "value": "088381683609"
            },
            {
                "key": "Manufacturer Part Number",
                "value": "HS7600"
            }
        ],
        "additional_info": {
            "material": "High Carbon Steel",
            "weight": "1.5 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "6 Months",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/6143fixsgEL._SL800_.jpg",
                "https://m.media-amazon.com/images/I/51xTW5xTKiL._SL800_.jpg",
                "https://m.media-amazon.com/images/I/61OnKEYQuUL._SL800_.jpg",
                "https://m.media-amazon.com/images/I/51AHdJ8u7EL._SL800_.jpg",
                "https://m.media-amazon.com/images/I/61kdK0z+-pL._SL800_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Makita-Powerful-Diameter-Circular-Adjustment/dp/B01GDUCC5G/ref=sr_1_10?dib=eyJ2IjoiMSJ9.ye6zrIHEnJTW2Z-f8oDdZKgIqZWhMeEeK-a1Zq-4XGD8ff6tgqtirA2-yBiVRHUa8tLUefTk7RGur-j9UQK77flcLckhGJs2siZzEVXFzRrNmuiDraI2SN6bnQsGCoAuHQXT_JPsyBtNdD6WKq2D7NoQALJMN6BpIYoquz_yj3sxIlzr-YoqP2OwrongTEiK_BsAjhdCCblZ0cRRgLS_iVgpKTlisIOFl6dhJhVgMQVjirsAwULDk6cnNoZySFo9WVu4ur52IRhUQr899UU_aw5vaAXe3xf4jEIAEt3usHI.RiwLr4EvKqVdEo2_VbvTBKQqPAXeak6CPGp_cMBOxdM&dib_tag=se&keywords=circular+saw+wood&qid=1783083793&refinements=p_36%3A740000-2300000&rnid=1318502031&sr=8-10",
        "updated_at": "2026-07-03T13:07:57.933Z",
        "created_at": "2026-07-03T13:07:57.933Z"
    },
    {
        "product_serial_id": 25,
        "sku": "BM-PT-CS-0008",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "KROST 7\" Cordless 37V Brushless Motor Circular Saw ",
        "brand": {
            "display": "KROST",
            "normalized": "krost"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 14921,
            "selling_price": 9947,
            "discount_percent": 33.34
        },
        "stock_quantity": 50,
        "short_description": "KROST 7\" Cordless 37V Brushless Motor Circular Saw For Ceramic, Tile, Stone, Woodworking | Portable Electric Saw (Blade Not Included)",
        "features": [
            "Intelligent gear shift, , with power display, more convenient work, 0-45 ° angle adjustment to meet cutting needs, convenient and fast",
            "Brushless motor, depth adjustment, angle adjustment, large battery, suitable for cutting a variety of materials, wireless restraint, powerful power, double",
            "power supply mode: direct current, operation mode: hand-held, motor: brushless, battery: lithium battery, free adjustment of tool-free depth adjustment design. Size: 185cm ; RPM: 3900"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "220 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "800 W"
            },
            {
                "key": "RPM",
                "value": "2800 RPM"
            }
        ],
        "additional_info": {
            "material": "High Carbon Steel",
            "weight": "2.3 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "1 Year Warranty",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71hZnoHCjPL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71qntbYNloL._SL1200_.jpg",
                "https://m.media-amazon.com/images/I/61GeAethhDL._SL1200_.jpg",
                "https://m.media-amazon.com/images/I/718Jz3-BcaL._SL1259_.jpg",
                "https://m.media-amazon.com/images/I/61Z8RZSoV2L._SL1200_.jpg",
                "https://m.media-amazon.com/images/I/61XsbncZKuL._SL1200_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/Cordless-Brushless-Circular-Woodworking-Electric/dp/B09T9LFP8C/ref=sr_1_30?dib=eyJ2IjoiMSJ9.ye6zrIHEnJTW2Z-f8oDdZKgIqZWhMeEeK-a1Zq-4XGD8ff6tgqtirA2-yBiVRHUa8tLUefTk7RGur-j9UQK77flcLckhGJs2siZzEVXFzRrNmuiDraI2SN6bnQsGCoAuHQXT_JPsyBtNdD6WKq2D7NoQALJMN6BpIYoquz_yj3sxIlzr-YoqP2OwrongTEiK_BsAjhdCCblZ0cRRgLS_iVgpKTlisIOFl6dhJhVgMQVjirsAwULDk6cnNoZySFo9WVu4ur52IRhUQr899UU_aw5vaAXe3xf4jEIAEt3usHI.RiwLr4EvKqVdEo2_VbvTBKQqPAXeak6CPGp_cMBOxdM&dib_tag=se&keywords=circular%2Bsaw%2Bwood&qid=1783083793&refinements=p_36%3A740000-2300000&rnid=1318502031&sr=8-30&th=1",
        "updated_at": "2026-07-03T13:16:46.325Z",
        "created_at": "2026-07-03T13:16:46.325Z"
    },
    {
        "product_serial_id": 26,
        "sku": "BM-PT-CS-0009",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "STANLEY FATMAX SCC500-B1 ",
        "brand": {
            "display": "STANLEY",
            "normalized": "stanley"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 8000,
            "selling_price": 7299,
            "discount_percent": 8.76
        },
        "stock_quantity": 11,
        "short_description": "STANLEY FATMAX SCC500-B1 20V 165mm 4000 RPM Cordless Brushed Circular Saw for Mechanic, Tradesmen & Professional Use, Batteries Not Included, 2 Year Warranty, YELLOW & BLACK",
        "features": [
            "Powerful high-performance motor provides up to 4,000 rpm",
            "Tool-free beveling shoe pivots up to 50° for angled cuts",
            "Contoured over-molded handle for comfort",
            "Compact and lightweight design helps reduce user fatigue",
            "The base of this circular saw is integrated with a bevelling shoe. It helps adjust the blade.",
            "Product does not include batteries",
            "2 Year warranty provided by the manufacturer from the date of purchase",
            "The product is manufactured by Stanley Black & Decker with registered trademarks"
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Cordless / Battery"
            },
            {
                "key": "Voltage",
                "value": "20 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "20 W"
            },
            {
                "key": "RPM",
                "value": "4000 RPM"
            },
            {
                "key": "Other Special Features of the Product",
                "value": "Bevel Capability"
            },
            {
                "key": "Number of Teeth",
                "value": "24"
            },
            {
                "key": "Cutting Angle",
                "value": "50 Degrees"
            },
            {
                "key": "Blade Shape",
                "value": "Round"
            },
            {
                "key": "Surface Recommendation",
                "value": "Wood"
            },
            {
                "key": "Warranty Type",
                "value": "limited warranty"
            },
            {
                "key": "Item Weight",
                "value": "1500 g"
            },
            {
                "key": "Blade Length",
                "value": "165 mm"
            }
        ],
        "additional_info": {
            "material": "ABS Plastic + Metal",
            "weight": "1.5 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "2 Years",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/71ocsd1nmKL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/51t1hDScYeL.jpg",
                "https://m.media-amazon.com/images/I/71ol1oiiQmL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/61JZY-DbWIL.jpg",
                "https://m.media-amazon.com/images/I/616IwcLUs8L._SL1000_.jpg",
                "https://m.media-amazon.com/images/I/718pQ+eX0yL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/51GsDUgSejL.jpg",
                "https://m.media-amazon.com/images/I/7159IP6TUZL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71E5LllHeQL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/SCC500-B1-Cordless-Circular-batteries-included/dp/B09J543M43/ref=sr_1_9?dib=eyJ2IjoiMSJ9.ye6zrIHEnJTW2Z-f8oDdZKgIqZWhMeEeK-a1Zq-4XGD8ff6tgqtirA2-yBiVRHUa8tLUefTk7RGur-j9UQK77flcLckhGJs2siZzEVXFzRrNmuiDraI2SN6bnQsGCoAuHQXT_JPsyBtNdD6WKq2D7NoQALJMN6BpIYoquz_yj3sxIlzr-YoqP2OwrongTEiK_BsAjhdCCblZ0cRRgLS_iVgpKTlisIOFl6dhJhVgMQVjirsAwULDk6cnNoZySFo9WVu4ur52IRhUQr899UU_aw5vaAXe3xf4jEIAEt3usHI.RiwLr4EvKqVdEo2_VbvTBKQqPAXeak6CPGp_cMBOxdM&dib_tag=se&keywords=circular+saw+wood&qid=1783083793&refinements=p_36%3A740000-2300000&rnid=1318502031&sr=8-9",
        "updated_at": "2026-07-03T13:22:18.195Z",
        "created_at": "2026-07-03T13:22:18.195Z"
    },
    {
        "product_serial_id": 27,
        "sku": "BM-PT-CS-0010",
        "category": "Power Tools",
        "subcategory": "Circular Saws",
        "name": "HYCHIKA Mini Circular Saw",
        "brand": {
            "display": "HYCHIKA",
            "normalized": "hychika"
        },
        "status": "Ready",
        "completeness_score": 100,
        "price": {
            "mrp": 30284,
            "selling_price": 23427,
            "discount_percent": 22.64
        },
        "stock_quantity": 7,
        "short_description": "HYCHIKA Mini Circular Saw, Circular Saw with 3 Saw Blades(85mm), Scale Ruler, 500W Pure Copper Motor, 4500RPM Ideal for Wood, Soft Metal, Tile and Plastic Cuts",
        "features": [
            "Ergnomic and Safe: The soft rubber handle reduces hand fatigue. The dust port can be connected to vacuum for a healthy environment. The double protection switch enhances safety in use.",
            "Powerful Motor: Featured with a 500W copper motor, the compact circular saw can reach a cutting speed of 4500RPM to cut tile, plastics, plaster board with ease.",
            "3 Blades and Wide Applications: Comes with 1x30T HW for wood and plastic, 1x36T HS for soft metal, 1xdiamond blade for ceramic tile, great for DIY projects.",
            "Precise and Adjustable Cutting Depth: The parallel guide allows you to make a precise and quick cut with ease. You can adjust the cutting depth from 0-25mm according to your need."
        ],
        "specifications": [
            {
                "key": "Power Source",
                "value": "Socket / Corded"
            },
            {
                "key": "Voltage",
                "value": "230 V"
            },
            {
                "key": "Power (Wattage)",
                "value": "500 W"
            },
            {
                "key": "RPM",
                "value": "4500 RPM"
            },
            {
                "key": "Brand",
                "value": "HYCHIKA BETTER TOOLS FOR BETTER LIFE"
            },
            {
                "key": "Colour",
                "value": "Mini Circular Saw"
            },
            {
                "key": "Blade Material",
                "value": "Diamond, HW, High Speed Steel"
            },
            {
                "key": "Surface Recommendation",
                "value": "Wood, Soft Metal, Tile, Plastic and PVC"
            },
            {
                "key": "Special Feature",
                "value": "Depth Adjustment, Ergonomic Handle, Keyed Blade Change, Spindle Lock"
            },
            {
                "key": "Product Dimensions",
                "value": "14L x 12.5W x 41.5H cm"
            },
            {
                "key": "Other Special Features of the Product",
                "value": "Depth Adjustment, Ergonomic Handle, Keyed Blade Change, Spindle Lock"
            },
            {
                "key": "Number of Teeth",
                "value": "30"
            },
            {
                "key": "Number of Batteries",
                "value": "1"
            },
            {
                "key": "Cutting Angle",
                "value": "90 Degrees"
            },
            {
                "key": "Blade Shape",
                "value": "Round"
            },
            {
                "key": "Handle Material",
                "value": "Rubber"
            },
            {
                "key": "Brand Name",
                "value": "HYCHIKA BETTER TOOLS FOR BETTER LIFE"
            },
            {
                "key": "Included Components",
                "value": "1 x Dust Exhaust Pipe, 1 x HYCHIKA Mini Circular Saw, 1 x 30T HW Blade, 1 x 36T HS Blade, 1 x Diamond Blade, 1 x Hex Key, 1 x Metal Guide Ruler, 1 x User Manual"
            }
        ],
        "additional_info": {
            "material": "High Carbon Steel",
            "weight": "1.8 kg",
            "country_of_origin": "China"
        },
        "warranty_period": "2 Years",
        "warranty_type": "Manufacturer Warranty",
        "box_items": [
            "1 x Product Unit",
            "1 x User Manual",
            "1 x Warranty Card",
            "1 x HYCHIKA Mini Circular Saw,",
            "1 x 30T HW Blade",
            "1 x 36T HS Blade",
            "1 x Diamond Blade",
            "1 x Dust Exhaust Pipe",
            "1 x User Manual",
            "1 x Hex Key",
            "1 x Metal Guide Ruler"
        ],
        "images": {
            "amazon": [
                "https://m.media-amazon.com/images/I/7107Xn60YzL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71lgc3aZEJL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71zVrUdT2KL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71MgJ2c0hjL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/717uVsChxvL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71d2tcG76QL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/7107Xn60YzL._SL1500_.jpg",
                "https://m.media-amazon.com/images/I/71DlLDHJfJL._SL1500_.jpg"
            ]
        },
        "amazon_url": "https://www.amazon.in/HYCHIKA-Circular-Blades-4500RPM-Plastic/dp/B07RZZMR7J/ref=sr_1_3?dib=eyJ2IjoiMSJ9.Td68jBjqL_cqXzdhQSKs9RVTgrZQC8Se0NMgUvcDoTemlCnrA_4gJEaM7F8y4G6tsyZ-9jRKvOcQecFtUTv9F0TsdEH_OjZSClMgnd5Lu8ySvvbyjzGExeLL9o9fTibVkQbfv5aK9hIPUC8HvHr8b-0HPuapf04nw6KG5u9YQVc4MqaDNnzBHe312szNM_f1mmGY9OoI2rSYuSyk_CSsoRu7fYb7YPRCp124Q5J93VsxLZemC0XV7WjK3WlBNYlM919munWm2uNTICtcMNcfkY4X-PezXZ2JcJMRIUdoeQE.9R0SXs1sG_jI1bgPHA-Ith51jPtQH8k0VxobF0ykK4M&dib_tag=se&keywords=circular%2Bsaw%2Bwood&qid=1783084978&refinements=p_36%3A2300000-&rnid=1318502031&sr=8-3&th=1",
        "updated_at": "2026-07-03T13:30:14.128Z",
        "created_at": "2026-07-03T13:30:14.128Z"
    }
];


class Database {
    constructor() {
        this.init();
    }

    init() {
        let existing = null;
        try {
            existing = JSON.parse(localStorage.getItem(DB_KEY));
        } catch(e) {
            existing = null;
        }

                // Auto-seed default catalog if localStorage is missing or has fewer products than the full 28-item catalog
        if (!existing || !existing.products || existing.products.length < 15) {
            const initialData = {
                metadata: { project: "BUILD MART", last_serial_id: 1000030, category_taxonomy: JSON.parse(JSON.stringify(DEFAULT_CATEGORY_TAXONOMY)) },
                products: DEFAULT_SEED_PRODUCTS
            };
            localStorage.setItem(DB_KEY, JSON.stringify(initialData));
            console.log("Auto-seeded full 28-item BuildMart hardware catalog!");
        } else if (!existing.metadata || !existing.metadata.category_taxonomy) {
            existing.metadata = existing.metadata || {};
            existing.metadata.category_taxonomy = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_TAXONOMY));
            localStorage.setItem(DB_KEY, JSON.stringify(existing));
        }
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(DB_KEY));
        } catch(e) {
            console.error("Failed to parse DB", e);
            return { metadata: { last_serial_id: 1000008 }, products: DEFAULT_SEED_PRODUCTS };
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('db-changed'));
        } catch(e) {
            console.error("Failed to save DB", e);
        }
    }

        getProducts(options) {
        const all = this.getData().products || [];
        if (!options) return all;

        let filtered = all;
        if (options.search) {
            const q = options.search.toLowerCase();
            filtered = filtered.filter(p => 
                (p.name || '').toLowerCase().includes(q) || 
                (p.sku || '').toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q)
            );
        }
        if (options.category && options.category !== 'all' && options.category !== '') {
            filtered = filtered.filter(p => p.category === options.category);
        }
        if (options.status && options.status !== 'all' && options.status !== '') {
            filtered = filtered.filter(p => p.status === options.status);
        }

        const page = options.page || 1;
        const limit = options.limit || 20;
        const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
            products: paginated,
            totalProducts: filtered.length,
            totalPages: totalPages
        };
    }

    getAllProducts() {
        return this.getData().products || [];
    }

    getCategoryTaxonomy() {
        const data = this.getData();
        const taxonomy = data.metadata && data.metadata.category_taxonomy;
        const source = taxonomy && typeof taxonomy === 'object' ? taxonomy : DEFAULT_CATEGORY_TAXONOMY;
        return Object.fromEntries(Object.entries(source).map(([category, subcategories]) => [
            this.normalizeWhitespace(category),
            [...new Set((Array.isArray(subcategories) ? subcategories : [])
                .map(value => this.normalizeWhitespace(value))
                .filter(Boolean))]
        ]).filter(([category]) => category));
    }

    saveCategoryTaxonomy(taxonomy) {
        const data = this.getData();
        data.metadata = data.metadata || {};
        data.metadata.category_taxonomy = taxonomy;
        this.saveData(data);
        return this.getCategoryTaxonomy();
    }

    addCategory(name) {
        const category = this.normalizeWhitespace(name);
        if (!category) return { ok: false, message: 'Enter a category name.' };
        const taxonomy = this.getCategoryTaxonomy();
        const existing = Object.keys(taxonomy).find(key => key.toLowerCase() === category.toLowerCase());
        if (existing) return { ok: false, message: `${existing} already exists.` };
        taxonomy[category] = [];
        this.saveCategoryTaxonomy(taxonomy);
        return { ok: true, message: `${category} added.` };
    }

    addSubcategory(categoryName, name) {
        const category = this.normalizeWhitespace(categoryName);
        const subcategory = this.normalizeWhitespace(name);
        const taxonomy = this.getCategoryTaxonomy();
        if (!taxonomy[category]) return { ok: false, message: 'Select a valid category.' };
        if (!subcategory) return { ok: false, message: 'Enter a subcategory name.' };
        const existing = taxonomy[category].find(value => value.toLowerCase() === subcategory.toLowerCase());
        if (existing) return { ok: false, message: `${existing} already exists under ${category}.` };
        taxonomy[category].push(subcategory);
        this.saveCategoryTaxonomy(taxonomy);
        return { ok: true, message: `${subcategory} added under ${category}.` };
    }

    removeCategory(name) {
        const category = this.normalizeWhitespace(name);
        const taxonomy = this.getCategoryTaxonomy();
        if (!Object.prototype.hasOwnProperty.call(taxonomy, category)) return { ok: false, message: 'Category not found.' };
        delete taxonomy[category];
        this.saveCategoryTaxonomy(taxonomy);
        return { ok: true, message: `${category} removed from selectable categories.` };
    }

    removeSubcategory(categoryName, name) {
        const category = this.normalizeWhitespace(categoryName);
        const subcategory = this.normalizeWhitespace(name);
        const taxonomy = this.getCategoryTaxonomy();
        if (!taxonomy[category]) return { ok: false, message: 'Category not found.' };
        const next = taxonomy[category].filter(value => value.toLowerCase() !== subcategory.toLowerCase());
        if (next.length === taxonomy[category].length) return { ok: false, message: 'Subcategory not found.' };
        taxonomy[category] = next;
        this.saveCategoryTaxonomy(taxonomy);
        return { ok: true, message: `${subcategory} removed from ${category}.` };
    }

    getProduct(sku) {
        const products = this.getProducts();
        return products.find(p => p.sku === sku) || null;
    }

    getLatestProduct() {
        const products = this.getAllProducts();
        return products.length ? products[products.length - 1] : null;
    }

    getNewSerialId() {
        const data = this.getData();
        const stored = Number(data.metadata && data.metadata.last_serial_id) || 1000000;
        const highest = (data.products || []).reduce((max, product) => {
            const serial = Number(product.product_serial_id);
            return Number.isFinite(serial) ? Math.max(max, serial) : max;
        }, stored);
        return highest + 1;
    }

    checkSkuExists(sku) {
        const normalized = String(sku || '').trim().toLowerCase();
        return this.getAllProducts().some(product =>
            String(product.sku || '').trim().toLowerCase() === normalized
        );
    }

    generateSku(category, subcategory) {
        const categoryCodes = {
            "Power Tools": "PT",
            "Hand Tools": "HT",
            "Tools & Accessories": "TA",
            "Fasteners & Small Hardware": "FH",
            "Wood Glues & Adhesives": "AD"
        };
        const subcategoryCodes = {
            "Drill Machines": "DR", "Angle Grinders": "AG", "Circular Saws": "CS",
            "Jigsaws": "JS", "Rotary Hammers": "RH", "Impact Drivers": "ID",
            "Sanders": "SD", "Heat Guns": "HG", "Electric Screwdrivers": "ES",
            "Polishers": "PL", "Hammers": "HM", "Screwdrivers": "SC",
            "Pliers": "PR", "Wrenches": "WR", "Spanners": "SP", "Chisels": "CH",
            "Measuring Tapes": "MT", "Utility Knives": "UK", "Clamps": "CL",
            "Spirit Levels": "SL", "Drill Bits": "DB", "Screwdriver Bits": "SB",
            "Saw Blades": "SW", "Grinding Wheels": "GW", "Cutting Discs": "CD",
            "Sanding Discs": "SD", "Hole Saws": "HS", "Router Bits": "RB",
            "Wire Brushes": "WB", "Polishing Pads": "PP", "Wood Glues": "WG",
            "General Adhesives": "GA", "PVA Adhesives": "PV", "Epoxy Adhesives": "EA",
            "Contact Adhesives": "CA", "Construction Adhesives": "CO", "Instant Adhesives": "IA",
            "Screws": "SC", "Nails": "NL", "Nuts": "NT", "Bolts": "BL",
            "Washers": "WS", "Wall Plugs & Anchors": "WA", "Rivets": "RV",
            "Staples": "ST", "Hooks & Eyes": "HE", "Pins & Clips": "PC"
        };

        const codeFromName = value => {
            const words = this.normalizeWhitespace(value).replace(/&/g, ' ').split(/\s+/).filter(Boolean);
            const code = words.length > 1
                ? words.map(word => word[0]).join('')
                : (words[0] || 'OT').slice(0, 2);
            return code.toUpperCase().slice(0, 3).padEnd(2, 'X');
        };
        const categoryCode = categoryCodes[category] || codeFromName(category);
        const subcategoryCode = subcategoryCodes[subcategory] || codeFromName(subcategory);
        const prefix = `BM-${categoryCode}-${subcategoryCode}-`;
        const highest = this.getAllProducts().reduce((max, product) => {
            const sku = String(product.sku || '');
            if (!sku.startsWith(prefix)) return max;
            const sequence = Number(sku.slice(prefix.length));
            return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
        }, 0);
        return prefix + String(highest + 1).padStart(4, '0');
    }

    getFieldValues() {
        const uniqueRecent = (values) => [...new Set(values.filter(Boolean).map(String))].slice(-8).reverse();
        const products = this.getAllProducts();
        return {
            brands: uniqueRecent(products.map(p => p.brand && p.brand.display ? p.brand.display : p.brand)),
            materials: uniqueRecent(products.map(p => p.additional_info && p.additional_info.material)),
            weights: uniqueRecent(products.map(p => p.additional_info && p.additional_info.weight)),
            countries: uniqueRecent(products.map(p => p.additional_info && p.additional_info.country_of_origin)),
            warranties: uniqueRecent(products.map(p => p.warranty_period))
        };
    }

    normalizeWhitespace(value) {
        return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    }

    normalizeBrand(value) {
        const raw = this.normalizeWhitespace(value && value.display ? value.display : value);
        if (!raw) return '';
        const known = {
            'bosch': 'BOSCH', 'dewalt': 'DEWALT', 'de walt': 'DEWALT',
            'makita': 'Makita', 'milwaukee': 'Milwaukee', 'stanley': 'STANLEY',
            'black+decker': 'BLACK+DECKER', 'black & decker': 'BLACK+DECKER',
            'ibell': 'iBELL', 'ingco': 'INGCO', 'taparia': 'Taparia',
            'hikoki': 'HiKOKI', 'hitachi': 'Hitachi', 'dremel': 'Dremel',
            '3m': '3M', 'pidilite': 'Pidilite', 'fevicol': 'Fevicol',
            'loctite': 'LOCTITE', 'araldite': 'Araldite'
        };
        const key = raw.toLowerCase();
        if (known[key]) return known[key];
        return raw
            .toLowerCase()
            .replace(/\b[a-z]/g, letter => letter.toUpperCase());
    }

    normalizeUnitText(value) {
        return this.normalizeWhitespace(value)
            .replace(/(\d+(?:\.\d+)?)\s*(?:watts?|watt)\b/gi, '$1 W')
            .replace(/(\d+(?:\.\d+)?)\s*(?:volts?|volt)\b/gi, '$1 V')
            .replace(/(\d+(?:\.\d+)?)\s*(?:millimeters?|millimetres?|mm)\b/gi, '$1 mm')
            .replace(/(\d+(?:\.\d+)?)\s*(?:centimeters?|centimetres?|cm)\b/gi, '$1 cm')
            .replace(/(\d+(?:\.\d+)?)\s*(?:kilograms?|kilogram|kgs?|kg)\b/gi, '$1 kg')
            .replace(/(\d+(?:\.\d+)?)\s*(?:grams?|gram|gms?|gm|g)\b/gi, '$1 g')
            .replace(/(\d+(?:\.\d+)?)\s*(?:newton[\s-]*meters?|newton[\s-]*metres?|nm)\b/gi, '$1 Nm')
            .replace(/(\d+(?:\.\d+)?)\s*(?:ampere[\s-]*hours?|amp[\s-]*hours?|ah)\b/gi, '$1 Ah')
            .replace(/(\d+(?:\.\d+)?)\s*(?:revolutions per minute|r\.?p\.?m\.?)\b/gi, '$1 RPM')
            .replace(/\s+/g, ' ')
            .trim();
    }

    normalizeWarranty(value) {
        return this.normalizeWhitespace(value)
            .replace(/(\d+(?:\.\d+)?)\s*months?\b/gi, '$1 Months')
            .replace(/(\d+(?:\.\d+)?)\s*years?\b/gi, '$1 Years')
            .replace(/(\d+(?:\.\d+)?)\s*days?\b/gi, '$1 Days');
    }

    normalizeCountry(value) {
        const raw = this.normalizeWhitespace(value);
        if (!raw) return '';
        const known = {
            'india': 'India', 'china': 'China', 'prc': 'China',
            'peoples republic of china': 'China', "people's republic of china": 'China',
            'germany': 'Germany', 'japan': 'Japan', 'usa': 'United States',
            'u.s.a.': 'United States', 'united states of america': 'United States',
            'uk': 'United Kingdom', 'u.k.': 'United Kingdom',
            'taiwan': 'Taiwan', 'south korea': 'South Korea'
        };
        return known[raw.toLowerCase()] || raw.replace(/\b[a-z]/g, letter => letter.toUpperCase());
    }

    canonicalProductUrl(value) {
        const raw = this.normalizeWhitespace(value);
        if (!raw) return '';
        try {
            const parsed = new URL(raw);
            const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
            const amazonMatch = parsed.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
            if (host.includes('amazon.') && amazonMatch) {
                return `https://www.${host}/dp/${amazonMatch[1].toUpperCase()}`;
            }
            if (host.includes('flipkart.com')) {
                const pid = parsed.searchParams.get('pid');
                const cleanPath = parsed.pathname.replace(/\/+$/, '');
                return `https://www.flipkart.com${cleanPath}${pid ? '?pid=' + encodeURIComponent(pid) : ''}`;
            }
            parsed.hash = '';
            ['ref', 'tag', 'linkCode', 'psc', 'th', 'dib', 'dib_tag', 'qid', 'sr', 'sprefix']
                .forEach(key => parsed.searchParams.delete(key));
            return parsed.href.replace(/\/$/, '');
        } catch (_) {
            return raw;
        }
    }

    getProductSourceId(value) {
        const url = this.canonicalProductUrl(value);
        if (!url) return '';
        try {
            const parsed = new URL(url);
            const amazonMatch = parsed.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
            if (amazonMatch) return 'amazon:' + amazonMatch[1].toUpperCase();
            const pid = parsed.searchParams.get('pid');
            if (pid) return 'flipkart:' + pid.toUpperCase();
        } catch (_) {}
        return 'url:' + url.toLowerCase();
    }

    productNameSimilarity(left, right) {
        const tokenize = value => {
            const stop = new Set(['the', 'and', 'with', 'for', 'from', 'tool', 'tools', 'product']);
            return new Set(
                this.normalizeWhitespace(value)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, ' ')
                    .split(' ')
                    .filter(token => token.length > 1 && !stop.has(token))
            );
        };
        const a = tokenize(left);
        const b = tokenize(right);
        if (!a.size || !b.size) return 0;
        const intersection = [...a].filter(token => b.has(token)).length;
        const union = new Set([...a, ...b]).size;
        return union ? intersection / union : 0;
    }

    findDuplicates(candidate, excludeSku = null) {
        const candidateSku = this.normalizeWhitespace(candidate && candidate.sku).toUpperCase();
        const candidateUrl = this.canonicalProductUrl(candidate && candidate.amazon_url);
        const candidateSource = this.getProductSourceId(candidateUrl);
        const candidateName = this.normalizeWhitespace(candidate && candidate.name);
        const results = [];

        this.getAllProducts().forEach(product => {
            if (excludeSku && product.sku === excludeSku) return;
            const reasons = [];
            const productSku = this.normalizeWhitespace(product.sku).toUpperCase();
            const productUrl = this.canonicalProductUrl(product.amazon_url);
            const productSource = this.getProductSourceId(productUrl);
            const similarity = this.productNameSimilarity(candidateName, product.name);

            if (candidateSku && candidateSku === productSku) reasons.push('Same SKU');
            if (candidateSource && candidateSource === productSource) reasons.push('Same source product ID');
            else if (candidateUrl && candidateUrl === productUrl) reasons.push('Same product URL');
            if (candidateName && similarity >= 0.82) reasons.push(`Similar name (${Math.round(similarity * 100)}%)`);

            if (reasons.length) {
                results.push({
                    sku: product.sku,
                    name: product.name,
                    reasons,
                    similarity
                });
            }
        });
        return results;
    }

    standardizeProduct(product) {
        const p = { ...product };
        const categoryMap = {
            'power tools': 'Power Tools',
            'hand tools': 'Hand Tools',
            'tools & accessories': 'Tools & Accessories',
            'tools and accessories': 'Tools & Accessories',
            'fasteners & small hardware': 'Fasteners & Small Hardware',
            'fasteners and small hardware': 'Fasteners & Small Hardware',
            'fasteners': 'Fasteners & Small Hardware',
            'small hardware': 'Fasteners & Small Hardware',
            'wood glues & adhesives': 'Wood Glues & Adhesives',
            'wood glues and adhesives': 'Wood Glues & Adhesives',
            'adhesives & consumables': 'Wood Glues & Adhesives',
            'adhesives and consumables': 'Wood Glues & Adhesives'
        };
        p.sku = this.normalizeWhitespace(p.sku).toUpperCase();
        p.name = this.normalizeWhitespace(p.name);
        p.category = categoryMap[this.normalizeWhitespace(p.category).toLowerCase()] || this.normalizeWhitespace(p.category);
        const subcategoryMap = {
            'wood glue': 'Wood Glues',
            'wood glues': 'Wood Glues',
            'general adhesive': 'General Adhesives',
            'general adhesives': 'General Adhesives',
            'pva adhesive': 'PVA Adhesives',
            'pva adhesives': 'PVA Adhesives',
            'epoxy adhesive': 'Epoxy Adhesives',
            'epoxy adhesives': 'Epoxy Adhesives',
            'contact adhesive': 'Contact Adhesives',
            'contact adhesives': 'Contact Adhesives',
            'construction adhesive': 'Construction Adhesives',
            'construction adhesives': 'Construction Adhesives',
            'instant adhesive': 'Instant Adhesives',
            'instant adhesives': 'Instant Adhesives'
        };
        const rawSubcategory = this.normalizeWhitespace(p.subcategory);
        p.subcategory = subcategoryMap[rawSubcategory.toLowerCase()] || rawSubcategory;
        const brandDisplay = this.normalizeBrand(p.brand);
        p.brand = { display: brandDisplay, normalized: brandDisplay.toLowerCase() };
        p.amazon_url = this.canonicalProductUrl(p.amazon_url);
        p.stock_quantity = Number(p.stock_quantity) || 0;
        p.completeness_score = Number(p.completeness_score) || 0;
        p.short_description = this.normalizeWhitespace(p.short_description);
        p.warranty_period = this.normalizeWarranty(p.warranty_period);
        p.warranty_type = this.normalizeWhitespace(p.warranty_type);

        p.price = {
            mrp: Number(p.price && p.price.mrp) || 0,
            selling_price: Number(p.price && p.price.selling_price) || 0,
            discount_percent: Number(p.price && p.price.discount_percent) || 0
        };
        if (p.pricing_basis && typeof p.pricing_basis === 'object') {
            p.pricing_basis = {
                quantity: Number(p.pricing_basis.quantity) || 0,
                unit: ['pcs', 'g', 'kg'].includes(p.pricing_basis.unit) ? p.pricing_basis.unit : 'pcs',
                price: Number(p.pricing_basis.price) || p.price.selling_price || 0,
                grams_per_piece: Number(p.pricing_basis.grams_per_piece) || null,
                pricing_rule: ['straight', 'bulk_5'].includes(p.pricing_basis.pricing_rule)
                    ? p.pricing_basis.pricing_rule
                    : 'straight',
                rounding: 'nearest_rupee'
            };
        } else {
            p.pricing_basis = null;
        }
        p.size_options = (Array.isArray(p.size_options) ? p.size_options : [])
            .map((size, index) => ({
                id: this.normalizeWhitespace(size.id) || `size-${index + 1}`,
                value: Number(size.value) || this.normalizeWhitespace(size.value),
                unit: ['mm', 'in'].includes(size.unit) ? size.unit : '',
                label: this.normalizeWhitespace(size.label) || `${size.value} ${size.unit || ''}`.trim(),
                base_price: Number(size.base_price) || 0,
                images: [...new Set((Array.isArray(size.images) ? size.images : [])
                    .map(image => this.normalizeWhitespace(image))
                    .filter(Boolean))],
                is_default: Boolean(size.is_default),
                sort_order: Number.isFinite(Number(size.sort_order)) ? Number(size.sort_order) : index
            }))
            .filter(size => size.value !== '')
            .sort((a, b) => a.sort_order - b.sort_order);
        if (p.size_options.length && !p.size_options.some(size => size.is_default)) p.size_options[0].is_default = true;
        let defaultSizeSeen = false;
        p.size_options.forEach(size => {
            if (!size.is_default) return;
            if (defaultSizeSeen) size.is_default = false;
            defaultSizeSeen = true;
        });
        p.sale_variants = (Array.isArray(p.sale_variants) ? p.sale_variants : [])
            .map((variant, index) => ({
                id: this.normalizeWhitespace(variant.id) || `pack-${index + 1}`,
                label: this.normalizeWhitespace(variant.label),
                size_id: this.normalizeWhitespace(variant.size_id),
                size_label: this.normalizeWhitespace(variant.size_label),
                is_combo: Boolean(variant.is_combo),
                included_size_ids: [...new Set((Array.isArray(variant.included_size_ids) ? variant.included_size_ids : [])
                    .map(id => this.normalizeWhitespace(id))
                    .filter(Boolean))],
                included_size_labels: this.normalizeWhitespace(variant.included_size_labels),
                quantity: Number(variant.quantity) || 0,
                unit: ['pcs', 'g', 'kg'].includes(variant.unit) ? variant.unit : 'pcs',
                price: Number(variant.price) || 0,
                mrp: Number(variant.mrp) || 0,
                is_default: Boolean(variant.is_default),
                price_source: variant.price_source === 'manual' ? 'manual' : 'calculated',
                sort_order: Number.isFinite(Number(variant.sort_order)) ? Number(variant.sort_order) : index
            }))
            .filter(variant => variant.quantity > 0 && variant.price > 0)
            .sort((a, b) => a.sort_order - b.sort_order);
        if (p.sale_variants.length && !p.sale_variants.some(variant => variant.is_default)) {
            p.sale_variants[0].is_default = true;
        }
        let defaultSeen = false;
        p.sale_variants.forEach(variant => {
            if (!variant.is_default) return;
            if (defaultSeen) variant.is_default = false;
            defaultSeen = true;
        });
        if (p.price.mrp > 0 && p.price.selling_price > 0) {
            p.price.discount_percent = Number((((p.price.mrp - p.price.selling_price) / p.price.mrp) * 100).toFixed(2));
        }

        const info = p.additional_info || {};
        p.additional_info = {
            material: this.normalizeWhitespace(info.material),
            weight: this.normalizeUnitText(info.weight),
            country_of_origin: this.normalizeCountry(info.country_of_origin)
        };

        const uniqueStrings = values => {
            const seen = new Set();
            return (Array.isArray(values) ? values : []).map(value => this.normalizeWhitespace(value)).filter(value => {
                const key = value.toLowerCase();
                if (!value || seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        };
        p.features = uniqueStrings(p.features);
        p.box_items = uniqueStrings(p.box_items);
        p.specifications = (Array.isArray(p.specifications) ? p.specifications : [])
            .map(spec => ({
                key: this.normalizeWhitespace(spec && spec.key),
                value: this.normalizeUnitText(spec && spec.value)
            }))
            .filter(spec => spec.key || spec.value)
            .filter((spec, index, list) =>
                list.findIndex(item =>
                    item.key.toLowerCase() === spec.key.toLowerCase() &&
                    item.value.toLowerCase() === spec.value.toLowerCase()
                ) === index
            );
        p.images = p.images && typeof p.images === 'object' ? p.images : { amazon: [] };
        p.images.amazon = uniqueStrings(p.images.amazon);
        return p;
    }

    auditProduct(product) {
        const issues = [];
        const add = (code, severity, label, field) => issues.push({ code, severity, label, field });
        const brand = product.brand && product.brand.display ? product.brand.display : product.brand;
        const info = product.additional_info || {};
        const price = product.price || {};
        const images = product.images && Array.isArray(product.images.amazon) ? product.images.amazon : [];
        const warrantyExempt = product.category === 'Fasteners & Small Hardware' &&
            ['Screws', 'Nails', 'Bolts'].includes(product.subcategory);
        const required = [
            ['sku', product.sku, 'SKU'],
            ['category', product.category, 'Category'],
            ['subcategory', product.subcategory, 'Subcategory'],
            ['name', product.name, 'Product name'],
            ['brand', brand, 'Brand'],
            ['amazon_url', product.amazon_url, 'Source URL'],
            ['material', info.material, 'Material'],
            ['weight', info.weight, 'Weight'],
            ['country_of_origin', info.country_of_origin, 'Country of origin'],
            ['short_description', product.short_description, 'Short description']
        ];
        if (!warrantyExempt) {
            required.push(
                ['warranty_period', product.warranty_period, 'Warranty period'],
                ['warranty_type', product.warranty_type, 'Warranty type']
            );
        }
        required.forEach(([field, value, label]) => {
            if (!this.normalizeWhitespace(value)) add('missing_' + field, 'error', `Missing ${label}`, field);
        });
        if (!(Number(price.selling_price) > 0)) add('invalid_price', 'error', 'Selling price must be greater than zero', 'price');
        if (!(Number(price.mrp) > 0)) add('invalid_mrp', 'error', 'MRP must be greater than zero', 'mrp');
        if (Number(price.mrp) > 0 && Number(price.selling_price) > Number(price.mrp)) {
            add('price_above_mrp', 'error', 'Selling price is greater than MRP', 'price');
        }
        if (Number(product.stock_quantity) < 0) add('negative_stock', 'error', 'Stock cannot be negative', 'stock_quantity');
        if (!Array.isArray(product.features) || !product.features.length) add('missing_features', 'error', 'No product features', 'features');
        if (!Array.isArray(product.specifications) || !product.specifications.length) {
            add('missing_specs', 'warning', 'No specifications collected', 'specifications');
        } else if (product.specifications.some(spec => !this.normalizeWhitespace(spec.key) || !this.normalizeWhitespace(spec.value))) {
            add('incomplete_specs', 'warning', 'One or more specifications are incomplete', 'specifications');
        }
        if (!images.length) {
            add('missing_images', 'error', 'No product images', 'images');
        } else {
            const seenImages = new Set();
            images.forEach(image => {
                const normalized = this.normalizeWhitespace(image).toLowerCase();
                try { new URL(image); } catch (_) { add('invalid_image_url', 'error', 'Invalid image URL', 'images'); }
                if (seenImages.has(normalized)) add('duplicate_image', 'warning', 'Duplicate image URL', 'images');
                seenImages.add(normalized);
            });
        }
        const duplicates = this.findDuplicates(product, product.sku);
        if (duplicates.length) add('duplicate_product', 'warning', `Possible duplicate of ${duplicates[0].sku}`, 'name');
        return issues;
    }

    standardizeAllProducts() {
        const data = this.getData();
        data.products = (data.products || []).map(product => this.standardizeProduct(product));
        this.saveData(data);
        return data.products.length;
    }

    deleteProduct(sku) {
        const data = this.getData();
        data.products = data.products.filter(p => p.sku !== sku);
        this.saveData(data);
    }

    getStats() {
        const products = this.getAllProducts();
        const categories = {};
        let totalValue = 0;
        let totalImages = 0;
        const brands = new Set();
        const now = new Date();
        const isToday = value => {
            if (!value) return false;
            const date = new Date(value);
            return !Number.isNaN(date.getTime()) &&
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate();
        };
        let todayCount = 0;

        products.forEach(rawProduct => {
            const p = this.standardizeProduct(rawProduct);
            const cat = p.category || 'Uncategorized';
            const subcat = p.subcategory || 'General';
            categories[cat] = categories[cat] || {};
            categories[cat][subcat] = (categories[cat][subcat] || 0) + 1;
            if (p.price && p.price.selling_price) {
                totalValue += (parseFloat(p.price.selling_price) || 0);
            }
            const brand = p.brand && p.brand.display ? p.brand.display : p.brand;
            if (brand && String(brand).trim()) brands.add(String(brand).trim().toLowerCase());
            const imageGroups = p.images && typeof p.images === 'object' ? Object.values(p.images) : [];
            totalImages += imageGroups.reduce((sum, group) => sum + (Array.isArray(group) ? group.filter(Boolean).length : 0), 0);
            if (isToday(p.created_at) || isToday(p.updated_at)) todayCount++;
        });

        const recentProducts = [...products].sort((left, right) => {
            const leftTime = new Date(left.updated_at || left.created_at || 0).getTime() || 0;
            const rightTime = new Date(right.updated_at || right.created_at || 0).getTime() || 0;
            return rightTime - leftTime;
        });

        return {
            totalProducts: products.length,
            categories: categories,
            totalImages,
            totalBrands: brands.size,
            todayCount,
            totalInventoryValue: totalValue,
            recentProducts: recentProducts.slice(0, 6),
            lastEditedProduct: recentProducts[0] || null
        };
    }

    saveProduct(p, isEdit = false, originalSku = null) {
        const data = this.getData();
        const lookupSku = isEdit && originalSku ? originalSku : p.sku;
        const existingIndex = data.products.findIndex(x => x.sku === lookupSku);
        const existing = existingIndex >= 0 ? data.products[existingIndex] : {};
        const now = new Date().toISOString();
        const brandDisplay = p.brand && typeof p.brand === 'object' ? p.brand.display : p.brand;
        const legacyPrice = p.price && typeof p.price === 'object'
            ? p.price
            : {
                mrp: Number(p.mrp) || 0,
                selling_price: Number(p.price) || 0,
                discount_percent: Number(p.discount_percent) || 0
            };
        const legacyAdditionalInfo = p.additional_info && typeof p.additional_info === 'object'
            ? p.additional_info
            : {
                material: p.material || '',
                weight: p.weight || '',
                country_of_origin: p.country_of_origin || ''
            };
        const legacyImages = p.images && typeof p.images === 'object'
            ? p.images
            : { amazon: Array.isArray(p.amazon_images) ? p.amazon_images : [] };

        let newProduct = {
            ...existing,
            ...p,
            product_serial_id: Number(p.product_serial_id) || Number(existing.product_serial_id) || this.getNewSerialId(),
            sku: p.sku,
            category: p.category || '',
            subcategory: p.subcategory || '',
            name: p.name || '',
            brand: {
                display: String(brandDisplay || '').trim(),
                normalized: String(brandDisplay || '').trim().toLowerCase()
            },
            status: p.status || 'Draft',
            completeness_score: Number(p.completeness_score) || 0,
            price: legacyPrice,
            pricing_basis: p.pricing_basis && typeof p.pricing_basis === 'object' ? p.pricing_basis : null,
            size_options: Array.isArray(p.size_options) ? p.size_options : [],
            sale_variants: Array.isArray(p.sale_variants) ? p.sale_variants : [],
            stock_quantity: Number(p.stock_quantity) || 0,
            short_description: p.short_description || '',
            features: Array.isArray(p.features) ? p.features : [],
            specifications: Array.isArray(p.specifications) ? p.specifications : [],
            additional_info: legacyAdditionalInfo,
            warranty_period: p.warranty_period || '',
            warranty_type: p.warranty_type || '',
            box_items: Array.isArray(p.box_items) ? p.box_items : [],
            images: legacyImages,
            amazon_url: p.amazon_url || '',
            created_at: existing.created_at || now,
            updated_at: now
        };

        // Flat form helpers are intentionally removed so every saved product keeps
        // the same legacy website-ready structure as the existing catalog.
        ['mrp', 'discount_percent', 'material', 'weight', 'country_of_origin', 'amazon_images']
            .forEach(key => delete newProduct[key]);
        newProduct = this.standardizeProduct(newProduct);

        if (newProduct.sku) {
            let index = existingIndex >= 0
                ? existingIndex
                : data.products.findIndex(x => x.sku === newProduct.sku);
            if (index === -1) {
                data.products.push(newProduct);
            } else {
                data.products[index] = newProduct;
            }
        } else {
            newProduct.sku = "BM-PT-" + Date.now();
            data.products.push(newProduct);
        }

        data.metadata = data.metadata || {};
        data.metadata.last_serial_id = Math.max(
            Number(data.metadata.last_serial_id) || 1000000,
            Number(newProduct.product_serial_id) || 0
        );
        this.saveData(data);
        return newProduct;
    }
}

// Global instance
window.db = new Database();
if (window.BuildMartFirebase) {
    window.BuildMartFirebase.attachDatabase(window.db);
} else {
    window.addEventListener('buildmart-firebase-adapter-ready', () => {
        window.BuildMartFirebase.attachDatabase(window.db);
    }, { once: true });
}
