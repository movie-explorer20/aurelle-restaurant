
const STORAGE_KEY = "aurelle_reservations_v1";
const CHANGE_EVENT = "aurelle:reservations-changed";

function localDateOffset(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createSampleReservations() {
  return [
    {
      id: "res-1001",
      guestName: "Olivia Bennett",
      email: "olivia@example.com",
      phone: "+44 7700 900101",
      date: localDateOffset(0),
      time: "19:00",
      guests: 2,
      occasion: "Anniversary",
      notes: "Quiet table preferred.",
      status: "Confirmed",
      estimatedTotal: 90,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-1002",
      guestName: "James Mitchell",
      email: "james@example.com",
      phone: "+44 7700 900102",
      date: localDateOffset(0),
      time: "20:00",
      guests: 4,
      occasion: "Birthday",
      notes: "",
      status: "Pending",
      estimatedTotal: 180,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-1003",
      guestName: "Amelia Carter",
      email: "amelia@example.com",
      phone: "+44 7700 900103",
      date: localDateOffset(1),
      time: "18:30",
      guests: 3,
      occasion: "Dinner",
      notes: "One vegetarian guest.",
      status: "Confirmed",
      estimatedTotal: 135,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-1004",
      guestName: "Noah Williams",
      email: "noah@example.com",
      phone: "+44 7700 900104",
      date: localDateOffset(-1),
      time: "19:30",
      guests: 2,
      occasion: "Dinner",
      notes: "",
      status: "Completed",
      estimatedTotal: 90,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-1005",
      guestName: "Isabella Thompson",
      email: "isabella@example.com",
      phone: "+44 7700 900105",
      date: localDateOffset(2),
      time: "20:30",
      guests: 6,
      occasion: "Family gathering",
      notes: "High chair requested.",
      status: "Pending",
      estimatedTotal: 270,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-1006",
      guestName: "Lucas Martin",
      email: "lucas@example.com",
      phone: "+44 7700 900106",
      date: localDateOffset(-2),
      time: "18:00",
      guests: 2,
      occasion: "Dinner",
      notes: "",
      status: "Cancelled",
      estimatedTotal: 90,
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-1007",
      guestName: "Sophia Anderson",
      email: "sophia@example.com",
      phone: "+44 7700 900107",
      date: localDateOffset(3),
      time: "19:00",
      guests: 5,
      occasion: "Celebration",
      notes: "Please seat us together.",
      status: "Confirmed",
      estimatedTotal: 225,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function loadReservations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }

    const initial = createSampleReservations();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (error) {
    console.error("Unable to load AURELLE reservations:", error);
    return createSampleReservations();
  }
}

export function saveReservations(reservations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch (error) {
    console.error("Unable to save AURELLE reservations:", error);
    return false;
  }
}

export function subscribeToReservations(callback) {
  const refresh = () => callback(loadReservations());

  window.addEventListener(CHANGE_EVENT, refresh);
  window.addEventListener("storage", refresh);

  return () => {
    window.removeEventListener(CHANGE_EVENT, refresh);
    window.removeEventListener("storage", refresh);
  };
}

export function formatReservationDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatMoney(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}
