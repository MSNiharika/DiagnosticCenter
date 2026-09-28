import type { Centre, Doctor, Referral, Staff } from "./types"

export const photos = {
  lab: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=80",
  bench: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80",
  vials: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1400&q=80",
  mri: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
  consult: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
  corridor: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
  woman: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  man: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
  woman2: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
  man2: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=900&q=80",
}

export const centres: Centre[] = [
  {
    id: "banjara",
    name: "Banjara Hills",
    city: "Hyderabad",
    address: "Road No. 12, Banjara Hills, Hyderabad 500034",
    hours: "6:30 AM – 9:00 PM",
    phone: "040 4455 2100",
    services: ["Pathology", "Radiology", "Cardiology", "Home collection"],
    image: photos.corridor,
    note: "Flagship lab. MRI, CT, and the pathologist desk sit on the same floor.",
  },
  {
    id: "jubilee",
    name: "Jubilee Hills",
    city: "Hyderabad",
    address: "Plot 18, Road No. 36, Jubilee Hills, Hyderabad 500033",
    hours: "7:00 AM – 8:00 PM",
    phone: "040 4455 2140",
    services: ["Pathology", "Cardiology", "Home collection"],
    image: photos.bench,
    note: "Blood, heart, and women's samples. Scans are routed to Banjara Hills.",
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    city: "Bengaluru",
    address: "100 Feet Road, Indiranagar, Bengaluru 560038",
    hours: "6:30 AM – 9:00 PM",
    phone: "080 4122 6600",
    services: ["Pathology", "Radiology", "Cardiology", "Home collection"],
    image: photos.lab,
    note: "Full imaging bay with a same-day echo room.",
  },
  {
    id: "tnagar",
    name: "T. Nagar",
    city: "Chennai",
    address: "Usman Road, T. Nagar, Chennai 600017",
    hours: "6:30 AM – 8:30 PM",
    phone: "044 4201 8800",
    services: ["Pathology", "Radiology", "Home collection"],
    image: photos.vials,
    note: "High-volume blood desk. Home routes cover the city before 11 AM.",
  },
  {
    id: "bandra",
    name: "Bandra West",
    city: "Mumbai",
    address: "Linking Road, Bandra West, Mumbai 400050",
    hours: "7:00 AM – 9:00 PM",
    phone: "022 4890 2200",
    services: ["Pathology", "Radiology", "Cardiology", "Home collection"],
    image: photos.mri,
    note: "MRI evenings till 9. Corporate draw camps leave from this hub.",
  },
  {
    id: "koregaon",
    name: "Koregaon Park",
    city: "Pune",
    address: "Lane 7, Koregaon Park, Pune 411001",
    hours: "7:00 AM – 7:00 PM",
    phone: "020 4120 7750",
    services: ["Pathology", "Home collection"],
    image: photos.consult,
    note: "A collection lounge. Imaging is referred to our partner bay and reported in Aurora.",
  },
  {
    id: "gk",
    name: "Greater Kailash",
    city: "Delhi",
    address: "M-Block Market, Greater Kailash II, New Delhi 110048",
    hours: "6:30 AM – 9:00 PM",
    phone: "011 4155 9090",
    services: ["Pathology", "Radiology", "Cardiology", "Home collection"],
    image: photos.corridor,
    note: "North hub. Critical results are called out by the duty pathologist.",
  },
]

export const cities = [...new Set(centres.map((centre) => centre.city))]

export const doctors: Doctor[] = [
  {
    id: "meera",
    name: "Dr. Meera Iyer",
    role: "Chief pathologist",
    cred: "MD Pathology · 18 years",
    focus: "Haematology and report validation",
    centre: "Banjara Hills",
    photo: photos.woman,
  },
  {
    id: "arjun",
    name: "Dr. Arjun Mehta",
    role: "Consultant radiologist",
    cred: "MD Radio-diagnosis · 14 years",
    focus: "MRI and chest imaging",
    centre: "Bandra West",
    photo: photos.man,
  },
  {
    id: "leela",
    name: "Dr. Leela Krishnan",
    role: "Consultant cardiologist",
    cred: "DM Cardiology · 12 years",
    focus: "Echo and stress tests",
    centre: "Indiranagar",
    photo: photos.woman2,
  },
  {
    id: "sameer",
    name: "Dr. Sameer Qureshi",
    role: "Biochemist",
    cred: "MD Biochemistry · 11 years",
    focus: "Quality control and special chemistry",
    centre: "Greater Kailash",
    photo: photos.man2,
  },
]

export const staff: Staff[] = [
  { name: "Dr. Meera Iyer", role: "Pathologist", centre: "Banjara Hills", shift: "8:00 – 4:00", state: "On floor" },
  { name: "Farah Sheikh", role: "Front desk lead", centre: "Banjara Hills", shift: "6:30 – 2:30", state: "On floor" },
  { name: "Kiran Rao", role: "Phlebotomy", centre: "Home routes", shift: "6:30 – 1:00", state: "On floor" },
  { name: "Naveen Paul", role: "Biochemistry", centre: "Banjara Hills", shift: "7:00 – 3:00", state: "On floor" },
  { name: "Dr. Arjun Mehta", role: "Radiologist", centre: "Bandra West", shift: "11:00 – 7:00", state: "On floor" },
  { name: "Anita D'Souza", role: "Quality officer", centre: "Network", shift: "9:00 – 6:00", state: "On floor" },
  { name: "Rohit Banerjee", role: "Inventory", centre: "Banjara Hills", shift: "9:00 – 6:00", state: "Off" },
  { name: "Sana Iqbal", role: "Patient care", centre: "Jubilee Hills", shift: "2:00 – 9:00", state: "Leave" },
]

export const referrals: Referral[] = [
  { name: "Dr. Nandini Rao", clinic: "Lake Clinic", city: "Hyderabad", orders: 86, revenue: 214000, payout: 21400 },
  { name: "Dr. Vivek Shah", clinic: "City Heart", city: "Mumbai", orders: 64, revenue: 188400, payout: 18840 },
  { name: "Dr. Pooja Menon", clinic: "Care & Cure", city: "Bengaluru", orders: 51, revenue: 97600, payout: 9760 },
  { name: "Dr. Imran Ali", clinic: "Family Desk", city: "Delhi", orders: 44, revenue: 81250, payout: 8125 },
  { name: "Dr. Shalini Gupta", clinic: "North Point", city: "Chennai", orders: 39, revenue: 70110, payout: 7011 },
]

export function centreById(id: string) {
  return centres.find((centre) => centre.id === id)
}
