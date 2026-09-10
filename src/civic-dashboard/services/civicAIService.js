const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function randomBetween(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  );
}

/*
  FRONTEND AI SIMULATION

  This is intentionally separated from the UI.
  Later this function can call your FastAPI + YOLO model.
*/

function simulatePotholeAI() {
  const level = randomBetween(1, 3);

  if (level === 1) {
    return {
      detected: "Pothole",
      confidence: randomBetween(88, 94),
      severity: "Low",
      risk: "Low",
      priority: "Normal",
      damage: "Minor road surface damage",
      recommendation:
        "Monitor and schedule routine road maintenance.",
      authentic: true,
      duplicate: false,
    };
  }

  if (level === 2) {
    return {
      detected: "Pothole",
      confidence: randomBetween(92, 97),
      severity: "Medium",
      risk: "Medium",
      priority: "High",
      damage: "Moderate road surface damage",
      recommendation:
        "Road maintenance should be scheduled soon.",
      authentic: true,
      duplicate: false,
    };
  }

  return {
    detected: "Pothole",
    confidence: randomBetween(95, 99),
    severity: "High",
    risk: "High",
    priority: "Urgent",
    damage: "Major/deep road damage",
    recommendation:
      "Immediate inspection and road repair recommended.",
    authentic: true,
    duplicate: false,
  };
}

function simulateGarbageAI() {
  const isEmpty = Math.random() >= 0.5;

  if (isEmpty) {
    return {
      detected: "Garbage Overflow",
      confidence: randomBetween(93, 98),
      severity: "Low",
      risk: "Low",
      priority: "Normal",
      binStatus: "Empty",
      points: 30,
      eligibleForReward: true,
      authentic: true,
      duplicate: false,
    };
  }

  return {
    detected: "Garbage Overflow",
    confidence: randomBetween(94, 99),
    severity: "High",
    risk: "High",
    priority: "Urgent",
    binStatus: "Full",
    points: 0,
    eligibleForReward: false,
    authentic: true,
    duplicate: false,
  };
}

function simulateOtherIssueAI(type) {
  const results = {
    "Flood / Waterlogging": {
      detected: "Flood / Waterlogging",
      confidence: randomBetween(91, 97),
      severity: "High",
      risk: "High",
      priority: "Urgent",
    },

    "Fallen Tree": {
      detected: "Fallen Tree",
      confidence: randomBetween(93, 98),
      severity: "High",
      risk: "High",
      priority: "Urgent",
    },

    "Blocked Drain": {
      detected: "Blocked Drain",
      confidence: randomBetween(90, 96),
      severity: "Medium",
      risk: "High",
      priority: "High",
    },
  };

  return {
    ...(results[type] || results["Blocked Drain"]),
    points: 0,
    eligibleForReward: false,
    authentic: true,
    duplicate: false,
  };
}

export async function analyzeIssue(
  type,
  image = null,
  video = null
) {
  console.log("CivicVision AI received:", {
    type,
    image,
    video,
  });

  await wait(1800);

  let result;

  if (type === "Pothole") {
    result = simulatePotholeAI();
  } else if (type === "Garbage Overflow") {
    result = simulateGarbageAI();
  } else {
    result = simulateOtherIssueAI(type);
  }

  return {
    ...result,
    issueType: type,
    image,
    video,
    analyzedAt: new Date().toISOString(),
  };
}