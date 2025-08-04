const { useState, useEffect, useRef } = React;

const PomodoroTimer = () => {
  // All your existing state and logic here
  const [focusTime, setFocusTime] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved).focusTime || 25 : 25;
  });

  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved).breakTime || 5 : 5;
  });

  const [reflectionTime, setReflectionTime] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved).reflectionTime || 5 : 5;
  });

  const [enableReflection, setEnableReflection] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved).enableReflection || false : false;
  });

  const [currentTime, setCurrentTime] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    const focusTime = saved ? JSON.parse(saved).focusTime || 25 : 25;
    return focusTime * 60;
  });

  const [isActive, setIsActive] = useState(false);
  const [currentMode, setCurrentMode] = useState("focus");
  const [showSettings, setShowSettings] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved).currentTheme || "minimal" : "minimal";
  });

  const [currentQuote, setCurrentQuote] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? JSON.parse(saved).journalEntries || [] : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [groupBy, setGroupBy] = useState("date");
  const [showExportImport, setShowExportImport] = useState(false);

  const intervalRef = useRef(null);

  // Auto-save to localStorage whenever settings change
  useEffect(() => {
    const settings = {
      focusTime,
      breakTime,
      reflectionTime,
      enableReflection,
      currentTheme,
      journalEntries,
    };
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
  }, [
    focusTime,
    breakTime,
    reflectionTime,
    enableReflection,
    currentTheme,
    journalEntries,
  ]);

  const themes = {
    minimal: {
      name: "Minimal White",
      background: "bg-gray-50",
      text: "text-gray-900",
      accent: "text-gray-600",
      button: "bg-gray-900 hover:bg-gray-800 text-white",
      card: "bg-white border-gray-200",
      progress: "#000000",
    },
    dark: {
      name: "Dark Mode",
      background: "bg-gray-900",
      text: "text-white",
      accent: "text-gray-400",
      button: "bg-white hover:bg-gray-100 text-gray-900",
      card: "bg-gray-800 border-gray-700",
      progress: "#ffffff",
    },
    blue: {
      name: "Blue Monochrome",
      background: "bg-blue-50",
      text: "text-blue-900",
      accent: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      card: "bg-white border-blue-200",
      progress: "#2563eb",
    },
    green: {
      name: "Nature Green",
      background: "bg-green-50",
      text: "text-green-900",
      accent: "text-green-600",
      button: "bg-green-600 hover:bg-green-700 text-white",
      card: "bg-white border-green-200",
      progress: "#16a34a",
    },
    purple: {
      name: "Royal Purple",
      background: "bg-purple-50",
      text: "text-purple-900",
      accent: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700 text-white",
      card: "bg-white border-purple-200",
      progress: "#9333ea",
    },
    red: {
      name: "Energy Red",
      background: "bg-red-50",
      text: "text-red-900",
      accent: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
      card: "bg-white border-red-200",
      progress: "#dc2626",
    },
  };

  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
    },
    {
      text: "Life is really simple, but we insist on making it complicated.",
      author: "Confucius",
    },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    {
      text: "You only live once, but if you do it right, once is enough.",
      author: "Mae West",
    },
    {
      text: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    },
    {
      text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
      author: "Albert Einstein",
    },
    {
      text: "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.",
      author: "Bernard M. Baruch",
    },
    {
      text: "A room without books is like a body without a soul.",
      author: "Marcus Tullius Cicero",
    },
    {
      text: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.",
      author: "Dr. Seuss",
    },
    {
      text: "Be the change that you wish to see in the world.",
      author: "Mahatma Gandhi",
    },
    {
      text: "In three words I can sum up everything I've learned about life: it goes on.",
      author: "Robert Frost",
    },
    {
      text: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.",
      author: "J.K. Rowling",
    },
    {
      text: "Don't walk in front of me… I may not follow. Don't walk behind me… I may not lead. Walk beside me… just be my friend.",
      author: "Albert Camus",
    },
    {
      text: "If you tell the truth, you don't have to remember anything.",
      author: "Mark Twain",
    },
    {
      text: "A friend is someone who knows all about you and still loves you.",
      author: "Elbert Hubbard",
    },
  ];

  const facts = [
    "A group of flamingos is called a 'flamboyance.'",
    "Bananas are berries, but strawberries aren't.",
    "Octopuses have three hearts and blue blood.",
    "A single cloud can weigh more than a million pounds.",
    "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
    "A group of pandas is called an 'embarrassment.'",
    "The shortest war in history lasted only 38-45 minutes (Anglo-Zanzibar War, 1896).",
    "Butterflies taste with their feet.",
    "A shrimp's heart is in its head.",
    "The Great Wall of China isn't visible from space with the naked eye.",
    "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    "There are more possible games of chess than atoms in the observable universe.",
    "Wombat poop is cube-shaped.",
    "A group of owls is called a 'parliament.'",
    "The unicorn is Scotland's national animal.",
    "Dolphins have names for each other.",
    "A bolt of lightning is six times hotter than the surface of the Sun.",
    "The longest recorded flight of a chicken is 13 seconds.",
    "Sea otters hold hands when they sleep to keep from drifting apart.",
    "A crocodile cannot stick its tongue out.",
    "The human brain is about 75% water.",
    "Sloths can hold their breath longer than dolphins.",
    "A group of crows is called a 'murder.'",
    "Penguin couples often mate for life and 'propose' with pebbles.",
    "The fingerprints of a koala are so indistinguishable from humans that they have on occasion been confused at a crime scene.",
    "Elephants are one of the few animals that can recognize themselves in a mirror.",
    "A group of pugs is called a 'grumble.'",
    "The average person walks past 36 murderers in their lifetime.",
    "Your stomach gets an entirely new lining every 3-4 days.",
    "The longest place name in the world has 85 letters.",
  ];

  const allContent = [
    ...quotes,
    ...facts.map((fact) => ({ text: fact, author: "Fun Fact" })),
  ];

  // Initialize with random quote
  useEffect(() => {
    setCurrentQuote(Math.floor(Math.random() * allContent.length));
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((time) => time - 1);
      }, 1000);
    } else if (currentTime === 0) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, currentTime]);

  const handleTimerComplete = () => {
    setIsActive(false);
    playAlarm();

    // Cycle through modes: focus → reflection (if enabled) → break → focus
    if (currentMode === "focus" && enableReflection) {
      setCurrentTime(reflectionTime * 60);
      setCurrentMode("reflection");
      setShowJournal(true);
      setIsWritingMode(true);
    } else if (currentMode === "focus" && !enableReflection) {
      setCurrentTime(breakTime * 60);
      setCurrentMode("break");
      setTimeout(() => setIsActive(true), 1000);
    } else if (currentMode === "reflection") {
      setCurrentTime(breakTime * 60);
      setCurrentMode("break");
      setTimeout(() => setIsActive(true), 1000);
    } else {
      setCurrentTime(focusTime * 60);
      setCurrentMode("focus");
      setTimeout(() => setIsActive(true), 1000);
    }

    // Show random quote/fact
    setCurrentQuote(Math.floor(Math.random() * allContent.length));
  };

  const playAlarm = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log("Audio not available");
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (currentMode === "focus") {
      setCurrentTime(focusTime * 60);
    } else if (currentMode === "break") {
      setCurrentTime(breakTime * 60);
    } else {
      setCurrentTime(reflectionTime * 60);
    }
  };

  const switchMode = () => {
    setIsActive(false);
    if (currentMode === "focus") {
      if (enableReflection) {
        setCurrentMode("reflection");
        setCurrentTime(reflectionTime * 60);
      } else {
        setCurrentMode("break");
        setCurrentTime(breakTime * 60);
      }
    } else if (currentMode === "reflection") {
      setCurrentMode("break");
      setCurrentTime(breakTime * 60);
    } else {
      setCurrentMode("focus");
      setCurrentTime(focusTime * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateFocusTime = (newTime) => {
    setFocusTime(newTime);
    if (currentMode === "focus" && !isActive) {
      setCurrentTime(newTime * 60);
    }
  };

  const updateBreakTime = (newTime) => {
    setBreakTime(newTime);
    if (currentMode === "break" && !isActive) {
      setCurrentTime(newTime * 60);
    }
  };

  const updateReflectionTime = (newTime) => {
    setReflectionTime(newTime);
    if (currentMode === "reflection" && !isActive) {
      setCurrentTime(newTime * 60);
    }
  };

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        content: journalEntry.trim(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        timestamp: new Date(),
        mood: selectedMood,
      };
      setJournalEntries((prev) => [newEntry, ...prev]);
      setJournalEntry("");
      setSelectedMood("neutral");
      setIsWritingMode(false);
      setShowJournal(false);
    }
  };

  const openJournal = () => {
    setShowJournal(true);
    setIsWritingMode(false);
  };

  const startWriting = () => {
    setJournalEntry("");
    setIsWritingMode(true);
  };

  const cancelWriting = () => {
    setJournalEntry("");
    setSelectedMood("neutral");
    setIsWritingMode(false);
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case "good":
        return "bg-green-500";
      case "bad":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const groupEntries = (entries) => {
    if (groupBy === "none") return { "All Entries": entries };

    if (groupBy === "mood") {
      return entries.reduce((groups, entry) => {
        const mood = entry.mood || "neutral";
        const key =
          mood === "good"
            ? "😊 Good"
            : mood === "bad"
              ? "😔 Difficult"
              : "😐 Neutral";
        if (!groups[key]) groups[key] = [];
        groups[key].push(entry);
        return groups;
      }, {});
    }

    return entries.reduce((groups, entry) => {
      const date = entry.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const filteredEntries = journalEntries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.date.includes(searchTerm) ||
      entry.time.includes(searchTerm),
  );

  const groupedEntries = groupEntries(filteredEntries);

  const exportSettings = () => {
    const settings = {
      focusTime,
      breakTime,
      reflectionTime,
      enableReflection,
      currentTheme,
      journalEntries,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pomodoro-settings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);

        if (
          settings.focusTime &&
          settings.focusTime >= 1 &&
          settings.focusTime <= 60
        ) {
          setFocusTime(settings.focusTime);
          if (currentMode === "focus" && !isActive) {
            setCurrentTime(settings.focusTime * 60);
          }
        }
        if (
          settings.breakTime &&
          settings.breakTime >= 1 &&
          settings.breakTime <= 30
        ) {
          setBreakTime(settings.breakTime);
          if (currentMode === "break" && !isActive) {
            setCurrentTime(settings.breakTime * 60);
          }
        }
        if (
          settings.reflectionTime &&
          settings.reflectionTime >= 1 &&
          settings.reflectionTime <= 30
        ) {
          setReflectionTime(settings.reflectionTime);
          if (currentMode === "reflection" && !isActive) {
            setCurrentTime(settings.reflectionTime * 60);
          }
        }
        if (typeof settings.enableReflection === "boolean") {
          setEnableReflection(settings.enableReflection);
        }
        if (settings.currentTheme && themes[settings.currentTheme]) {
          setCurrentTheme(settings.currentTheme);
        }
        if (settings.journalEntries && Array.isArray(settings.journalEntries)) {
          setJournalEntries(settings.journalEntries);
        }

        alert("Settings imported successfully!");
        setShowExportImport(false);
      } catch (error) {
        alert("Error importing settings. Please check the file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const theme = themes[currentTheme];
  const progress =
    (((currentMode === "focus"
      ? focusTime * 60
      : currentMode === "break"
        ? breakTime * 60
        : reflectionTime * 60) -
      currentTime) /
      (currentMode === "focus"
        ? focusTime * 60
        : currentMode === "break"
          ? breakTime * 60
          : reflectionTime * 60)) *
    100;

  // SVG Icons (since we can't import Lucide React in this setup)
  const PlayIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );

  const PauseIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );

  const RotateCcwIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1,4 1,10 7,10" />
      <path d="M3.51,15a9,9,0,0,0,2.13-9.36L1,10" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12,1V5M12,19V23M4.22,4.22L6.34,6.34M17.66,17.66L19.78,19.78M1,12H5M19,12H23M4.22,19.78L6.34,17.66M17.66,6.34L19.78,4.22" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18,15 12,9 6,15" />
    </svg>
  );

  return (
    <div
      className={`min-h-screen ${theme.background} transition-all duration-500 flex flex-col`}
    >
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div
            className={`text-sm font-bold tracking-wider uppercase ${theme.accent}`}
          >
            {currentMode === "focus"
              ? "FOCUS"
              : currentMode === "break"
                ? "BREAK"
                : "REFLECT"}
          </div>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.progress }}
          />
        </div>

        <div className="flex space-x-3">
          {enableReflection && (
            <button
              onClick={openJournal}
              className={`px-4 py-2 text-sm font-medium rounded ${theme.button} transition-colors`}
            >
              Journal
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded ${theme.button} transition-colors`}
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Giant Timer Display */}
        <div className="text-center mb-12">
          <div
            className={`text-8xl md:text-9xl font-light ${theme.text} font-mono tracking-tight leading-none`}
          >
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-6 mb-16">
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full ${theme.button} flex items-center justify-center transition-all hover:scale-105 shadow-lg`}
          >
            {isActive ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            onClick={resetTimer}
            className={`w-16 h-16 rounded-full ${theme.button} flex items-center justify-center transition-all hover:scale-105 shadow-lg`}
          >
            <RotateCcwIcon />
          </button>

          <button
            onClick={switchMode}
            className={`px-6 py-3 rounded-full ${theme.button} transition-all hover:scale-105 shadow-lg font-medium`}
          >
            {currentMode === "focus"
              ? "Focus"
              : currentMode === "break"
                ? "Break"
                : "Reflect"}
          </button>
        </div>

        {/* Quote Section */}
        <div className="max-w-2xl text-center">
          <p
            className={`text-xl md:text-2xl font-light ${theme.text} leading-relaxed mb-4`}
          >
            "{allContent[currentQuote]?.text}"
          </p>
          <p
            className={`text-sm font-medium ${theme.accent} tracking-wide uppercase`}
          >
            — {allContent[currentQuote]?.author}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="p-6">
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: theme.progress,
            }}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`${theme.card} rounded-xl p-6 border max-w-md w-full max-h-96 overflow-y-auto`}
          >
            <h3 className={`text-xl font-bold ${theme.text} mb-6`}>Settings</h3>

            {/* Export/Import */}
            <div className="mb-6">
              <button
                onClick={() => setShowExportImport(!showExportImport)}
                className={`w-full flex items-center justify-between p-3 rounded ${theme.button} transition-colors`}
              >
                <span>Backup & Restore</span>
                {showExportImport ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>

              {showExportImport && (
                <div className="mt-3 space-y-2">
                  <button
                    onClick={exportSettings}
                    className={`w-full p-3 text-left rounded border ${theme.card} ${theme.text} hover:bg-gray-50 transition-colors`}
                  >
                    Export Settings & Journal
                  </button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      className={`w-full p-3 text-left rounded border ${theme.card} ${theme.text} hover:bg-gray-50 transition-colors`}
                    >
                      Import Settings & Journal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="mb-6">
              <button
                onClick={() => setShowThemes(!showThemes)}
                className={`w-full flex items-center justify-between p-3 rounded ${theme.button} transition-colors`}
              >
                <span>Theme: {theme.name}</span>
                {showThemes ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>

              {showThemes && (
                <div className="mt-3 space-y-2">
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCurrentTheme(key);
                        setShowThemes(false);
                      }}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        currentTheme === key
                          ? `${theme.button}`
                          : `${theme.card} ${theme.text} hover:bg-gray-50`
                      }`}
                    >
                      {themeOption.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reflection Toggle */}
            <div className="flex items-center justify-between mb-6">
              <label className={`font-medium ${theme.text}`}>
                Enable Reflection
              </label>
              <button
                onClick={() => setEnableReflection(!enableReflection)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  enableReflection ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    enableReflection ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Time Settings */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${theme.text}`}>Focus Time</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateFocusTime(Math.max(1, focusTime - 1))}
                    className={`w-8 h-8 rounded ${theme.button} flex items-center justify-center`}
                  >
                    -
                  </button>
                  <span
                    className={`${theme.text} min-w-12 text-center font-mono`}
                  >
                    {focusTime}m
                  </span>
                  <button
                    onClick={() => updateFocusTime(Math.min(60, focusTime + 1))}
                    className={`w-8 h-8 rounded ${theme.button} flex items-center justify-center`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`font-medium ${theme.text}`}>Break Time</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateBreakTime(Math.max(1, breakTime - 1))}
                    className={`w-8 h-8 rounded ${theme.button} flex items-center justify-center`}
                  >
                    -
                  </button>
                  <span
                    className={`${theme.text} min-w-12 text-center font-mono`}
                  >
                    {breakTime}m
                  </span>
                  <button
                    onClick={() => updateBreakTime(Math.min(30, breakTime + 1))}
                    className={`w-8 h-8 rounded ${theme.button} flex items-center justify-center`}
                  >
                    +
                  </button>
                </div>
              </div>

              {enableReflection && (
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${theme.text}`}>
                    Reflection Time
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateReflectionTime(Math.max(1, reflectionTime - 1))
                      }
                      className={`w-8 h-8 rounded ${theme.button} flex items-center justify-center`}
                    >
                      -
                    </button>
                    <span
                      className={`${theme.text} min-w-12 text-center font-mono`}
                    >
                      {reflectionTime}m
                    </span>
                    <button
                      onClick={() =>
                        updateReflectionTime(Math.min(30, reflectionTime + 1))
                      }
                      className={`w-8 h-8 rounded ${theme.button} flex items-center justify-center`}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className={`w-full mt-6 py-3 ${theme.button} rounded font-medium`}
            >
              Close Settings
            </button>
          </div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`${theme.card} rounded-xl p-6 border max-w-md w-full max-h-96 overflow-hidden`}
          >
            {isWritingMode ? (
              <div>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                  {currentMode === "reflection"
                    ? "Reflection Time"
                    : "Write Entry"}
                </h3>

                <div className="mb-4">
                  <label className={`block font-medium ${theme.accent} mb-2`}>
                    How are you feeling?
                  </label>
                  <div className="flex space-x-2">
                    {[
                      { key: "good", icon: "😊", label: "Good" },
                      { key: "neutral", icon: "😐", label: "Neutral" },
                      { key: "bad", icon: "😔", label: "Difficult" },
                    ].map((mood) => (
                      <button
                        key={mood.key}
                        onClick={() => setSelectedMood(mood.key)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded border transition-colors ${
                          selectedMood === mood.key
                            ? `${theme.button}`
                            : `${theme.card} ${theme.text} hover:bg-gray-50`
                        }`}
                      >
                        <span>{mood.icon}</span>
                        <span className="text-sm">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder={
                    currentMode === "reflection"
                      ? "What went well? What could be improved? Any insights?"
                      : "Write your thoughts..."
                  }
                  className={`w-full h-32 p-3 rounded border ${theme.card} ${theme.text} resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  autoFocus
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={
                      currentMode === "reflection"
                        ? () => setShowJournal(false)
                        : cancelWriting
                    }
                    className={`px-4 py-2 rounded border ${theme.card} ${theme.text} hover:bg-gray-50 transition-colors`}
                  >
                    {currentMode === "reflection" ? "Skip" : "Cancel"}
                  </button>
                  <button
                    onClick={saveJournalEntry}
                    className={`px-4 py-2 ${theme.button} rounded transition-colors`}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${theme.text}`}>
                    Journal Entries
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value)}
                      className={`px-2 py-1 text-sm rounded border ${theme.card} ${theme.text}`}
                    >
                      <option value="date">By Date</option>
                      <option value="mood">By Mood</option>
                      <option value="none">All</option>
                    </select>
                    <button
                      onClick={startWriting}
                      className={`px-3 py-1 text-sm ${theme.button} rounded transition-colors`}
                    >
                      Write
                    </button>
                    <button
                      onClick={() => setShowJournal(false)}
                      className={`text-xl ${theme.text} hover:bg-gray-100 w-8 h-8 rounded flex items-center justify-center`}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search entries..."
                  className={`w-full p-2 rounded border ${theme.card} ${theme.text} mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />

                <div className="space-y-4 max-h-48 overflow-y-auto">
                  {Object.keys(groupedEntries).length === 0 ? (
                    <p className={`${theme.accent} text-center py-8`}>
                      No entries found
                    </p>
                  ) : (
                    Object.entries(groupedEntries).map(
                      ([groupName, entries]) => (
                        <div key={groupName}>
                          {groupBy !== "none" && (
                            <h4
                              className={`text-sm font-bold ${theme.accent} mb-2 border-b pb-1 uppercase tracking-wide`}
                            >
                              {groupName} ({entries.length})
                            </h4>
                          )}
                          <div className="space-y-2">
                            {entries.map((entry) => (
                              <div
                                key={entry.id}
                                className={`p-3 rounded border ${theme.card} relative`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div
                                    className={`text-xs ${theme.accent} font-mono`}
                                  >
                                    {groupBy !== "date" && `${entry.date} at `}
                                    {entry.time}
                                  </div>
                                  <div
                                    className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood || "neutral")}`}
                                  />
                                </div>
                                <p
                                  className={`${theme.text} text-sm leading-relaxed`}
                                >
                                  {entry.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<PomodoroTimer />, document.getElementById("app"));
