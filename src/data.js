export const data = {
  nodes: [
    {
      id: 1,
      id: "Power",
      type: "Primary"
    },
    {
      id: 2,
      id: "Technology",
      type: "Primary"
    },
    {
      id: 3,
      id: "Justice",
      type: "Primary"
    },
    {
      id: 4,
      id: "Industry",
      type: "Primary"
    },
    {id: "State", type: "Secondary"},
    {id: "Surveillance", type: "Secondary"},
    {id: "Education", type: "Secondary"},
    {id: "Epistemologies", type: "Secondary"},
    {id: "Policy", type: "Secondary"},
    {id: "Individual", type: "Secondary"},
    {id: "Citizen", type: "Secondary"},
    {id: "Undocumented migrants", type: "Secondary"},
    {id: "Algorithms", type: "Secondary"},
    {id: "Border control", type: "Secondary"},
    {id: "Transparency", type: "Secondary"},
    {id: "Surveillance", type: "Secondary"},
    {id: "Police", type: "Secondary"},
    {id: "Software", type: "Secondary"},
    {id: "Transparency", type: "Secondary"},
    {id: "Hardware", type: "Secondary"},
    {id: "Justice", type: "Secondary"},
    {id: "Legibility", type: "Secondary"},
    {id: "Accessibility", type: "Secondary"},
    {id: "Accountability", type: "Secondary"},
    {id: "Industry", type: "Secondary"},
    {id: "Corporations", type: "Secondary"},
    {id: "Money", type: "Secondary"},
  ],
  links: [
    {
      source: "Power",
      target: "State",
      label: "link 1 and 2",
    },
    {
      source: "Police",
      target: "Surveillance",
    },
    {
      source: "State",
      target: "Police",
    },
    {
      source: "Power",
      target: "Education",
    },
    { source: "Education", target: "Epistemologies" },
    { source: "Power", target: "Policy" },
    { source: "Power", target: "Individual" },
    { source: "Individual", target: "Citizen" },
    { source: "Power", target: "Undocumented migrants" },
    { source: "Undocumented migrants", target: "Border control" },
    { source: "Technology", target: "Algorithms" },
    { source: "Algorithms", target: "Transparency" },
    { source: "Technology", target: "Surveillance" },
    { source: "Surveillance", target: "Police" },
    { source: "Technology", target: "Software" },
    { source: "Technology", target: "Hardware" },
    { source: "Justice", target: "Transparency" },
    { source: "Justice", target: "Legibility" },
    { source: "Justice", target: "Accessibility" },
    { source: "Justice", target: "Accountability" },
    { source: "Industry", target: "Corporations" },
    { source: "Industry", target: "Money" },
    ],
};
