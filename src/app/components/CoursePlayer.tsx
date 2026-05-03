import { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, Settings, Maximize,
  Subtitles, ChevronDown, ChevronRight, Check, Plus, Clock,
  MessageSquare, FileText, Download, BookOpen, X, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursePlayerProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Note {
  id: string;
  timestamp: string;
  text: string;
  videoTime: number;
}

type TabType = 'overview' | 'notes' | 'qa' | 'resources';

export function CoursePlayer({ courseId, courseTitle, onBack }: CoursePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 60 minutes for demo
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['1']);
  const [currentLesson, setCurrentLesson] = useState('1-1');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showResumeDialog, setShowResumeDialog] = useState(true);
  const [resumeTime, setResumeTime] = useState(734); // 12:34 for demo

  const videoRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const courseSections: Section[] = [
    {
      id: '1',
      title: 'Getting Started with Python',
      lessons: [
        { id: '1-1', title: 'Introduction to Python', duration: '12:34', completed: true },
        { id: '1-2', title: 'Installing Python & Setup', duration: '8:45', completed: true },
        { id: '1-3', title: 'Your First Python Program', duration: '15:20', completed: true },
      ],
    },
    {
      id: '2',
      title: 'Python Fundamentals',
      lessons: [
        { id: '2-1', title: 'Variables and Data Types', duration: '18:30', completed: false },
        { id: '2-2', title: 'Operators and Expressions', duration: '14:15', completed: false },
        { id: '2-3', title: 'Control Flow Statements', duration: '22:10', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Functions and Modules',
      lessons: [
        { id: '3-1', title: 'Defining Functions', duration: '16:40', completed: false },
        { id: '3-2', title: 'Function Parameters', duration: '19:25', completed: false },
        { id: '3-3', title: 'Working with Modules', duration: '13:50', completed: false },
      ],
    },
  ];

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentTime(Math.min(currentTime + 10, duration));
  };

  const skipBackward = () => {
    setCurrentTime(Math.max(currentTime - 10, 0));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(percent * duration);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectLesson = (lessonId: string) => {
    setCurrentLesson(lessonId);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const markLessonComplete = () => {
    // Animation and state update logic
    console.log('Lesson marked complete');
  };

  const addNote = () => {
    if (noteText.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        timestamp: formatTime(currentTime),
        text: noteText,
        videoTime: currentTime,
      };
      setNotes([...notes, newNote]);
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  const resumeFromSaved = () => {
    setCurrentTime(resumeTime);
    setShowResumeDialog(false);
    setIsPlaying(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTime]);

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const totalLessons = courseSections.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedLessons = courseSections.reduce(
    (acc, section) => acc + section.lessons.filter(l => l.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Resume Dialog */}
      <AnimatePresence>
        {showResumeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome back!</h3>
              <p className="text-lg text-gray-600 mb-6">
                You were watching at <span className="font-bold text-purple-600">{formatTime(resumeTime)}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={resumeFromSaved}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => {
                    setShowResumeDialog(false);
                    setCurrentTime(0);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{courseTitle}</h1>
              <p className="text-sm text-gray-400">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              Progress: <span className="font-bold text-purple-400">{Math.round((completedLessons / totalLessons) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Video Player */}
          <div
            ref={videoRef}
            className="relative bg-black aspect-video"
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
              <div className="text-center text-white">
                <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <p className="text-xl opacity-75">Video Player</p>
              </div>
            </div>

            {/* Play/Pause Overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <button
                    onClick={togglePlayPause}
                    className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                  >
                    <Play className="w-12 h-12 text-white ml-2" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
                >
                  {/* Progress Bar */}
                  <div
                    onClick={handleProgressClick}
                    className="group cursor-pointer mb-4"
                  >
                    <div className="h-1.5 bg-white/30 rounded-full overflow-hidden group-hover:h-2 transition-all">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause */}
                      <button
                        onClick={togglePlayPause}
                        className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>

                      {/* Skip Buttons */}
                      <button
                        onClick={skipBackward}
                        className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <button
                        onClick={skipForward}
                        className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <SkipForward className="w-5 h-5" />
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-white" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>

                      {/* Time */}
                      <span className="text-white text-sm font-semibold">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Speed Control */}
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors text-sm font-semibold"
                        >
                          {playbackSpeed}x
                        </button>
                        <AnimatePresence>
                          {showSpeedMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700"
                            >
                              {speedOptions.map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => {
                                    setPlaybackSpeed(speed);
                                    setShowSpeedMenu(false);
                                  }}
                                  className={`block w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors ${
                                    speed === playbackSpeed ? 'bg-purple-600' : ''
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Subtitles */}
                      <button
                        onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                        className={`p-2 rounded-lg transition-colors ${
                          subtitlesEnabled ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/20'
                        }`}
                      >
                        <Subtitles className="w-5 h-5" />
                      </button>

                      {/* Fullscreen */}
                      <button className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs & Content */}
          <div className="flex-1 bg-white overflow-auto">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex gap-1 px-6">
                {(['overview', 'notes', 'qa', 'resources'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-semibold capitalize transition-all relative ${
                      activeTab === tab
                        ? 'text-purple-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About this course</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Learn Python programming from scratch. This comprehensive course covers everything from basic syntax to advanced concepts including functions, modules, and object-oriented programming.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Duration</p>
                        <p className="text-xl font-bold text-gray-900">12 hours</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                        <p className="text-xl font-bold text-gray-900">Beginner</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">My Notes</h3>
                      <button
                        onClick={() => setShowNoteInput(!showNoteInput)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Take Note
                      </button>
                    </div>

                    <AnimatePresence>
                      {showNoteInput && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 bg-purple-50 p-4 rounded-lg border-2 border-purple-200"
                        >
                          <div className="flex items-center gap-2 mb-3 text-sm text-purple-600 font-semibold">
                            <Clock className="w-4 h-4" />
                            At {formatTime(currentTime)}
                          </div>
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Write your note here..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                            rows={4}
                          />
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={addNote}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                              Save Note
                            </button>
                            <button
                              onClick={() => {
                                setShowNoteInput(false);
                                setNoteText('');
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-4">
                      {notes.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No notes yet. Start taking notes while watching!</p>
                        </div>
                      ) : (
                        notes.map((note) => (
                          <div key={note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <button
                                onClick={() => setCurrentTime(note.videoTime)}
                                className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                              >
                                <Clock className="w-4 h-4" />
                                {note.timestamp}
                              </button>
                              <button className="text-gray-400 hover:text-red-600">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-gray-700">{note.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'qa' && (
                  <motion.div
                    key="qa"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions & Answers</h3>
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No questions yet. Be the first to ask!</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'resources' && (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Resources</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="font-semibold text-gray-900">Python Cheat Sheet</p>
                            <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                          </div>
                        </div>
                        <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Course Content</h2>
            <p className="text-sm text-gray-600">
              {completedLessons}/{totalLessons} lessons completed
            </p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4">
            {courseSections.map((section) => (
              <div key={section.id} className="mb-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="font-semibold text-gray-900">{section.title}</span>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            currentLesson === lesson.id
                              ? 'bg-purple-100 border-2 border-purple-600'
                              : 'hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              lesson.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {lesson.completed && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1 text-left">
                            <p
                              className={`text-sm font-semibold ${
                                currentLesson === lesson.id ? 'text-purple-600' : 'text-gray-900'
                              }`}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">{lesson.duration}</p>
                          </div>
                          {currentLesson === lesson.id && (
                            <Play className="w-4 h-4 text-purple-600" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={markLessonComplete}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Check className="w-5 h-5" />
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
