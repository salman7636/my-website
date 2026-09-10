const civicMockReports = [
  {
    id: "CV-DEMO-001",
    issueType: "Pothole",
    description:
      "Large pothole reported on the roadside.",
    image: "",
    location: {
      lat: 12.9716,
      lon: 77.5946,
      accuracy: 15,
    },
    analysis: {
      detection: "Pothole",
      confidence: 94,
      severity: "High",
      risk: "High",
      priority: "Urgent",
      binStatus: null,
      authentic: true,
    },
    status: "Submitted",
    points: 0,
    createdAt: "Demo report",
  },
];

export default civicMockReports;