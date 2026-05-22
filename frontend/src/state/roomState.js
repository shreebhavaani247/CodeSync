export const room = { 
  roomId: "ABC123", 
  users: [ 
    { name: "Bhavaani", role: "Interviewer", online: true }, 
    { name: "Rahul", role: "Candidate", online: true } 
  ], 
  code: `// start coding...
function helloWorld() {
  console.log("Welcome to CodeSync!");
}

helloWorld();`, 
  language: "javascript", 
  messages: [ 
    { user: "Rahul", text: "Working on solution...", time: "10:05 AM" },
    { user: "Bhavaani", text: "Great, let me know if you need any hints.", time: "10:06 AM" }
  ], 
  problem: { 
    title: "Two Sum", 
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order." 
  }, 
  snapshots: ["Version 1", "Version 2"], 
  typingUser: "Rahul", 
  timer: "25:00", 
  mode: "interview" 
}; 
