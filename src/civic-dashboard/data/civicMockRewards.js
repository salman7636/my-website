const civicMockRewards = {
  pointsPerCleanBin: 30,

  rules: [
    {
      title: "Empty garbage bin",
      points: 30,
      eligible: true,
    },
    {
      title: "Full / overflowing bin",
      points: 0,
      eligible: false,
    },
    {
      title: "Other civic issues",
      points: 0,
      eligible: false,
    },
  ],
};

export default civicMockRewards;