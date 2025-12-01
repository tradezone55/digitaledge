import { useState, useEffect } from "react";
import {
  Clock,
  BarChart3,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Logo from "../components/ui/Logo";
import SupportBanner from "../components/SupportBanner";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch";
import {
  useQuizStateManager,
  restoreStateFromURL,
  syncStateWithURL,
  hasQuizParams,
  getCurrentDomain,
  getCurrentQuestion
} from "../utils/urlParams";

// Type definitions
interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  wrongExplanations: (string | null)[];
  topic: string;
}

interface QuestionTemplate {
  question: string;
  choices: string[];
  correct: number;
}

interface UserAnswer {
  questionIndex: number;
  selected: number;
  correct: boolean;
}

interface Attempt {
  date: string;
  score: number;
  total: number;
  duration: number;
  passed: boolean;
}

interface Domain {
  name: string;
  percentage: number;
  color: string;
}

interface AccessScreenProps {
  inGracePeriod?: boolean;
  graceDaysLeft?: number;
  daysLeft?: number;
  isTrial?: boolean;
}

type DomainId = 1 | 2 | 3 | 4 | 5;

const AccessScreen = ({ }: AccessScreenProps) => {
  const { t } = useTranslation(['quiz', 'common', 'dashboard']);
  const { getQuizState, setQuizState } = useQuizStateManager();

  // Initialize state from URL parameters or localStorage fallback
  const [currentDomain, setCurrentDomainState] = useState<DomainId>(() => {
    return getCurrentDomain() as DomainId;
  });
  const [currentQuestion, setCurrentQuestionState] = useState(() => {
    return getCurrentQuestion();
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [score, setScoreState] = useState(() => {
    const quizState = getQuizState();
    return quizState.score || 0;
  });
  const [timeElapsed, setTimeElapsedState] = useState(() => {
    const quizState = getQuizState();
    return quizState.timeElapsed || 0;
  });
  const [sessionActive, setSessionActiveState] = useState(() => {
    const quizState = getQuizState();
    return quizState.sessionActive || false;
  });
  const [sessionComplete, setSessionCompleteState] = useState(() => {
    const quizState = getQuizState();
    return quizState.sessionComplete || false;
  });
  const [showResults, setShowResultsState] = useState(() => {
    const quizState = getQuizState();
    return quizState.showResults || false;
  });

  // Load attempts from localStorage or use default
  const [attempts, setAttempts] = useState<Record<DomainId, Attempt[]>>(() => {
    try {
      const savedAttempts = localStorage.getItem("comptia-attempts");
      return savedAttempts
        ? JSON.parse(savedAttempts)
        : {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
        };
    } catch (error) {
      console.error("Error loading attempts from localStorage:", error);
      return {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      };
    }
  });

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // Load domain pass status from localStorage or use default
  const [domainsPassed, setDomainsPassed] = useState<Record<DomainId, boolean>>(
    () => {
      try {
        const savedDomainsPassed = localStorage.getItem(
          "comptia-domains-passed"
        );
        return savedDomainsPassed
          ? JSON.parse(savedDomainsPassed)
          : {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
          };
      } catch (error) {
        console.error("Error loading domains passed from localStorage:", error);
        return { 1: false, 2: false, 3: false, 4: false, 5: false };
      }
    }
  );

  const [showDomainSelect, setShowDomainSelect] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);

  // Close domain selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDomainSelect && !target.closest('.domain-selector')) {
        setShowDomainSelect(false);
      }
    };

    if (showDomainSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDomainSelect]);

  // Wrapper functions that update both local state and URL parameters
  const setCurrentDomain = (domain: DomainId) => {
    setCurrentDomainState(domain);
    setQuizState({ domain }, true); // Replace history to avoid cluttering
  };

  const setCurrentQuestion = (question: number) => {
    setCurrentQuestionState(question);
    setQuizState({ question });
  };

  const setScore = (score: number) => {
    setScoreState(score);
    setQuizState({ score });
  };

  const setTimeElapsed = (time: number) => {
    setTimeElapsedState(time);
    setQuizState({ timeElapsed: time });
  };

  const setSessionActive = (active: boolean) => {
    setSessionActiveState(active);
    setQuizState({ sessionActive: active });
  };

  const setSessionComplete = (complete: boolean) => {
    setSessionCompleteState(complete);
    setQuizState({ sessionComplete: complete });
  };

  const setShowResults = (show: boolean) => {
    setShowResultsState(show);
    setQuizState({ showResults: show });
  };

  // Domain Information
  const domains: Record<DomainId, Domain> = {
    1: { name: t('quiz:domains.1'), percentage: 24, color: "blue" },
    2: { name: t('quiz:domains.2'), percentage: 19, color: "green" },
    3: { name: t('quiz:domains.3'), percentage: 16, color: "yellow" },
    4: { name: t('quiz:domains.4'), percentage: 19, color: "red" },
    5: { name: t('quiz:domains.5'), percentage: 22, color: "purple" },
  };

  // Get translated questions
  const getTranslatedQuestions = (domainId: DomainId): Question[] => {
    const questions = t(`questions:domains.${domainId}`, { returnObjects: true }) as Question[];
    return questions || [];
  };

  // Create comprehensive question pools
  const createQuestionPool = (domainId: DomainId): Question[] => {
    const translatedQuestions = getTranslatedQuestions(domainId);

    // Fallback to hardcoded questions if translations are not available
    const baseQuestions: Record<DomainId, Question[]> = {
      1: [
        {
          id: 1,
          question: "Which device operates at OSI Layer 3?",
          choices: ["Router", "WAP", "Switch", "Hub"],
          correct: 0,
          explanation:
            "Routers operate at Layer 3 (Network Layer), making routing decisions based on IP addresses.",
          wrongExplanations: [
            null,
            "WAP operates at Layer 2, handling wireless frame transmission.",
            "Switches operate at Layer 2, making decisions based on MAC addresses.",
            "Hubs operate at Layer 1, simply repeating signals.",
          ],
          topic: "1.2 — Network devices",
        },
        {
          id: 2,
          question: "What is the maximum cable length for Cat 6 Ethernet?",
          choices: ["50 meters", "100 meters", "200 meters", "500 meters"],
          correct: 1,
          explanation:
            "Cat 6 has a maximum length of 100 meters for optimal performance.",
          wrongExplanations: [
            "50 meters is unnecessarily short for Cat 6.",
            null,
            "200 meters exceeds Cat 6 specifications.",
            "500 meters would cause severe signal degradation.",
          ],
          topic: "1.3 — Cables & connectors",
        },
        {
          id: 3,
          question: "Which protocol operates at the Transport Layer?",
          choices: ["IP", "TCP", "Ethernet", "ARP"],
          correct: 1,
          explanation:
            "TCP operates at Layer 4, providing reliable data delivery.",
          wrongExplanations: [
            "IP operates at Layer 3 for routing.",
            null,
            "Ethernet operates at Layer 2 for frame transmission.",
            "ARP operates between Layers 2-3 for address resolution.",
          ],
          topic: "1.1 — OSI model",
        },
        {
          id: 4,
          question: "What is the IP address class of 172.16.0.1?",
          choices: ["Class A", "Class B", "Class C", "Class D"],
          correct: 1,
          explanation:
            "172.16.0.1 falls in the Class B range (128.0.0.0 to 191.255.255.255).",
          wrongExplanations: [
            "Class A ranges from 1.0.0.0 to 126.255.255.255.",
            null,
            "Class C ranges from 192.0.0.0 to 223.255.255.255.",
            "Class D is for multicast (224.0.0.0 to 239.255.255.255).",
          ],
          topic: "1.4 — IP addressing",
        },
        {
          id: 5,
          question: "How many host addresses are available in a /26 subnet?",
          choices: ["30", "62", "126", "254"],
          correct: 1,
          explanation:
            "A /26 subnet has 6 host bits, giving 2^6 - 2 = 62 usable host addresses.",
          wrongExplanations: [
            "30 addresses would be a /27 subnet.",
            null,
            "126 addresses would be a /25 subnet.",
            "254 addresses would be a /24 subnet.",
          ],
          topic: "1.4 — Subnetting",
        },
        {
          id: 6,
          question: "Which topology has no single point of failure?",
          choices: ["Star", "Ring", "Mesh", "Bus"],
          correct: 2,
          explanation:
            "Mesh topology provides multiple paths, eliminating single points of failure.",
          wrongExplanations: [
            "Star topology's central device is a single point of failure.",
            "Ring topology can fail if any link breaks.",
            null,
            "Bus topology can fail at multiple points along the backbone.",
          ],
          topic: "1.2 — Network topologies",
        },
        {
          id: 7,
          question: "What does CSMA/CD stand for?",
          choices: [
            "Carrier Sense Multiple Access/Collision Detection",
            "Central Switch Multiple Access/Collision Domain",
            "Carrier Signal Multiple Access/Connection Detection",
            "Central System Multiple Access/Collision Detection",
          ],
          correct: 0,
          explanation:
            "CSMA/CD is used in traditional Ethernet to detect and handle collisions.",
          wrongExplanations: [
            null,
            "This describes switching concepts incorrectly.",
            "This misinterprets the carrier and collision components.",
            "This incorrectly defines the CS component.",
          ],
          topic: "1.5 — Ethernet standards",
        },
        {
          id: 8,
          question: "Which layer handles data encryption in the OSI model?",
          choices: ["Session", "Presentation", "Application", "Transport"],
          correct: 1,
          explanation:
            "The Presentation Layer handles encryption, compression, and data formatting.",
          wrongExplanations: [
            "Session Layer manages connections between applications.",
            null,
            "Application Layer provides network services to applications.",
            "Transport Layer handles reliable data delivery.",
          ],
          topic: "1.1 — OSI model",
        },
        {
          id: 9,
          question: "What is the speed of Gigabit Ethernet?",
          choices: ["100 Mbps", "1000 Mbps", "10 Gbps", "100 Gbps"],
          correct: 1,
          explanation: "Gigabit Ethernet operates at 1000 Mbps (1 Gbps).",
          wrongExplanations: [
            "100 Mbps is Fast Ethernet speed.",
            null,
            "10 Gbps is 10 Gigabit Ethernet.",
            "100 Gbps is ultra-high speed Ethernet.",
          ],
          topic: "1.5 — Ethernet standards",
        },
        {
          id: 10,
          question:
            "Which cable type is immune to electromagnetic interference?",
          choices: ["UTP", "STP", "Coaxial", "Fiber optic"],
          correct: 3,
          explanation:
            "Fiber optic cables use light signals and are immune to EMI.",
          wrongExplanations: [
            "UTP is susceptible to EMI.",
            "STP reduces but doesn't eliminate EMI.",
            "Coaxial has some EMI resistance but not immunity.",
            null,
          ],
          topic: "1.3 — Cable types",
        },
      ],
      2: [
        {
          id: 51,
          question: "Which routing protocol is distance-vector?",
          choices: ["OSPF", "RIP", "BGP", "IS-IS"],
          correct: 1,
          explanation:
            "RIP (Routing Information Protocol) is a distance-vector routing protocol.",
          wrongExplanations: [
            "OSPF is a link-state routing protocol.",
            null,
            "BGP is a path-vector routing protocol.",
            "IS-IS is a link-state routing protocol.",
          ],
          topic: "2.2 — Routing protocols",
        },
        {
          id: 52,
          question: "What is the default administrative distance for OSPF?",
          choices: ["90", "100", "110", "120"],
          correct: 2,
          explanation: "OSPF has a default administrative distance of 110.",
          wrongExplanations: [
            "90 is the default for EIGRP.",
            "100 is the default for IGRP.",
            null,
            "120 is the default for RIP.",
          ],
          topic: "2.2 — Routing protocols",
        },
        {
          id: 53,
          question: "Which VLAN is the default on Cisco switches?",
          choices: ["VLAN 0", "VLAN 1", "VLAN 10", "VLAN 100"],
          correct: 1,
          explanation: "VLAN 1 is the default VLAN on Cisco switches.",
          wrongExplanations: [
            "VLAN 0 doesn't exist as a standard VLAN.",
            null,
            "VLAN 10 is not the default.",
            "VLAN 100 is not the default.",
          ],
          topic: "2.3 — VLANs",
        },
      ],
      3: [
        {
          id: 101,
          question: "Which command shows the routing table on Windows?",
          choices: ["ipconfig", "route print", "netstat", "tracert"],
          correct: 1,
          explanation:
            "The 'route print' command displays the routing table on Windows systems.",
          wrongExplanations: [
            "ipconfig shows IP configuration, not routing table.",
            null,
            "netstat shows network connections and statistics.",
            "tracert traces the path to a destination.",
          ],
          topic: "3.1 — Network tools",
        },
        {
          id: 102,
          question: "What does SNMP stand for?",
          choices: [
            "Simple Network Management Protocol",
            "Secure Network Management Protocol",
            "System Network Management Protocol",
            "Standard Network Management Protocol",
          ],
          correct: 0,
          explanation:
            "SNMP is Simple Network Management Protocol, used for network monitoring.",
          wrongExplanations: [
            null,
            "SNMP is not inherently secure in its basic form.",
            "SNMP is not system-specific.",
            "SNMP is not a standard in the formal sense.",
          ],
          topic: "3.2 — Network monitoring",
        },
      ],
      4: [
        {
          id: 151,
          question:
            "Which type of attack involves flooding a network with traffic?",
          choices: [
            "Man-in-the-middle",
            "DDoS",
            "Social engineering",
            "SQL injection",
          ],
          correct: 1,
          explanation:
            "DDoS (Distributed Denial of Service) attacks flood networks with excessive traffic.",
          wrongExplanations: [
            "Man-in-the-middle attacks intercept communications.",
            null,
            "Social engineering manipulates people, not network traffic.",
            "SQL injection targets databases, not network traffic.",
          ],
          topic: "4.2 — Network attacks",
        },
        {
          id: 152,
          question: "What is the purpose of a firewall?",
          choices: [
            "Encrypt data",
            "Filter network traffic",
            "Assign IP addresses",
            "Resolve domain names",
          ],
          correct: 1,
          explanation:
            "Firewalls filter network traffic based on predetermined security rules.",
          wrongExplanations: [
            "VPNs and encryption protocols encrypt data.",
            null,
            "DHCP assigns IP addresses.",
            "DNS resolves domain names.",
          ],
          topic: "4.1 — Firewalls",
        },
      ],
      5: [
        {
          id: 201,
          question:
            "What is the first step in network troubleshooting methodology?",
          choices: [
            "Implement solution",
            "Identify the problem",
            "Test theory",
            "Document findings",
          ],
          correct: 1,
          explanation:
            "The first step is always to identify and clearly define the problem.",
          wrongExplanations: [
            "Solutions are implemented after identifying and testing.",
            null,
            "Theories are tested after gathering information.",
            "Documentation comes at the end of the process.",
          ],
          topic: "5.1 — Troubleshooting methodology",
        },
        {
          id: 202,
          question:
            "Which layer should you check first when troubleshooting connectivity?",
          choices: ["Application", "Transport", "Network", "Physical"],
          correct: 3,
          explanation:
            "Start troubleshooting at the Physical layer (Layer 1) and work your way up.",
          wrongExplanations: [
            "Application layer issues are checked after lower layers.",
            "Transport layer is checked after Physical and Data Link.",
            "Network layer is checked after Physical and Data Link.",
            null,
          ],
          topic: "5.2 — OSI troubleshooting",
        },
      ],
    };

    // Create specific questions for each domain
    const domainQuestions: Record<DomainId, QuestionTemplate[]> = {
      1: [
        // Networking Fundamentals
        {
          question: "Which subnet mask corresponds to a /25 network?",
          choices: [
            "255.255.255.0",
            "255.255.255.128",
            "255.255.255.192",
            "255.255.255.224",
          ],
          correct: 1,
        },
        {
          question: "What is the broadcast address for 192.168.1.64/26?",
          choices: [
            "192.168.1.127",
            "192.168.1.95",
            "192.168.1.63",
            "192.168.1.255",
          ],
          correct: 0,
        },
        {
          question: "Which connector is used with single-mode fiber?",
          choices: ["ST", "SC", "LC", "MT-RJ"],
          correct: 2,
        },
        {
          question:
            "What is the difference between half-duplex and full-duplex?",
          choices: [
            "Speed difference",
            "Directional capability",
            "Cable type",
            "Protocol used",
          ],
          correct: 1,
        },
        {
          question: "Which IEEE standard defines wireless networking?",
          choices: ["802.1", "802.3", "802.11", "802.16"],
          correct: 2,
        },
        {
          question: "What is the purpose of ARP?",
          choices: [
            "Route packets",
            "Resolve IP to MAC",
            "Encrypt data",
            "Assign IP addresses",
          ],
          correct: 1,
        },
        {
          question: "Which cable category supports 10 Gigabit Ethernet?",
          choices: ["Cat 5", "Cat 5e", "Cat 6", "Cat 6A"],
          correct: 3,
        },
        {
          question: "What does MTU stand for?",
          choices: [
            "Maximum Transmission Unit",
            "Multiple Transfer Unit",
            "Media Transfer Unit",
            "Maximum Transfer Utility",
          ],
          correct: 0,
        },
        {
          question: "Which OSI layer handles flow control?",
          choices: ["Layer 2", "Layer 3", "Layer 4", "Layer 5"],
          correct: 2,
        },
        {
          question: "What is the standard frame size for Ethernet?",
          choices: ["1024 bytes", "1500 bytes", "2048 bytes", "9000 bytes"],
          correct: 1,
        },
        {
          question: "Which address range is used for APIPA?",
          choices: [
            "10.0.0.0/8",
            "169.254.0.0/16",
            "172.16.0.0/12",
            "192.168.0.0/16",
          ],
          correct: 1,
        },
        {
          question: "What is the purpose of a default gateway?",
          choices: [
            "Assign IP addresses",
            "Route to other networks",
            "Filter traffic",
            "Encrypt data",
          ],
          correct: 1,
        },
        {
          question: "Which protocol provides reliable data delivery?",
          choices: ["IP", "UDP", "TCP", "ICMP"],
          correct: 2,
        },
        {
          question: "What is the maximum transmission distance for Cat 5e?",
          choices: ["55 meters", "100 meters", "185 meters", "500 meters"],
          correct: 1,
        },
        {
          question: "Which device creates collision domains?",
          choices: ["Hub", "Switch", "Router", "Bridge"],
          correct: 1,
        },
        {
          question: "What does ICMP provide?",
          choices: [
            "File transfer",
            "Error reporting",
            "Email delivery",
            "Web browsing",
          ],
          correct: 1,
        },
        {
          question: "Which layer adds MAC addresses to frames?",
          choices: ["Physical", "Data Link", "Network", "Transport"],
          correct: 1,
        },
        {
          question: "What is the purpose of subnetting?",
          choices: [
            "Increase speed",
            "Divide networks",
            "Encrypt data",
            "Route packets",
          ],
          correct: 1,
        },
        {
          question: "Which cable type uses RJ45 connectors?",
          choices: ["Coaxial", "Twisted pair", "Fiber optic", "Serial"],
          correct: 1,
        },
        {
          question: "What does the LLC sublayer provide?",
          choices: [
            "Physical signaling",
            "Media access control",
            "Logical link control",
            "Network routing",
          ],
          correct: 2,
        },
        {
          question: "Which multiplexing technique uses time slots?",
          choices: ["FDM", "TDM", "WDM", "CDM"],
          correct: 1,
        },
        {
          question: "What is the difference between UTP and STP?",
          choices: [
            "Speed rating",
            "Shielding",
            "Connector type",
            "Maximum length",
          ],
          correct: 1,
        },
        {
          question: "Which network topology uses a central hub?",
          choices: ["Bus", "Ring", "Star", "Mesh"],
          correct: 2,
        },
        {
          question: "What does Auto-MDIX detect?",
          choices: ["Speed", "Cable type", "Duplex", "Errors"],
          correct: 1,
        },
        {
          question: "Which fiber connector uses a push-pull mechanism?",
          choices: ["ST", "SC", "LC", "FC"],
          correct: 1,
        },
        {
          question: "What is the IPv4 loopback address?",
          choices: ["127.0.0.1", "192.168.1.1", "10.0.0.1", "172.16.0.1"],
          correct: 0,
        },
        {
          question: "Which Ethernet standard operates at 100 Mbps?",
          choices: ["10BASE-T", "100BASE-TX", "1000BASE-T", "10GBASE-T"],
          correct: 1,
        },
        {
          question: "What does CSMA/CA prevent?",
          choices: ["Errors", "Collisions", "Delays", "Interference"],
          correct: 1,
        },
        {
          question: "Which OSI layer handles session establishment?",
          choices: ["Transport", "Session", "Presentation", "Application"],
          correct: 1,
        },
        {
          question: "What is the purpose of the preamble in Ethernet frames?",
          choices: [
            "Error detection",
            "Synchronization",
            "Addressing",
            "Data payload",
          ],
          correct: 1,
        },
        {
          question: "Which cable type is best for long distances?",
          choices: ["UTP", "STP", "Coaxial", "Fiber optic"],
          correct: 3,
        },
        {
          question: "What does the Network layer provide?",
          choices: [
            "Frame delivery",
            "Logical addressing",
            "Physical signaling",
            "Session management",
          ],
          correct: 1,
        },
        {
          question: "Which device operates at the Physical layer?",
          choices: ["Switch", "Router", "Hub", "Bridge"],
          correct: 2,
        },
        {
          question: "What is the difference between TCP and UDP?",
          choices: ["Speed", "Reliability", "Security", "Compatibility"],
          correct: 1,
        },
        {
          question: "Which address type uses FF:FF:FF:FF:FF:FF?",
          choices: ["Unicast", "Multicast", "Broadcast", "Anycast"],
          correct: 2,
        },
        {
          question: "What does the Transport layer guarantee?",
          choices: ["Speed", "Delivery", "Security", "Compatibility"],
          correct: 1,
        },
        {
          question: "Which cable specification supports PoE+?",
          choices: ["Cat 5", "Cat 5e", "Cat 6", "Cat 6A"],
          correct: 2,
        },
        {
          question: "What is the purpose of VLANs?",
          choices: [
            "Increase speed",
            "Logical segmentation",
            "Reduce costs",
            "Improve security",
          ],
          correct: 1,
        },
        {
          question: "Which protocol resolves MAC to IP addresses?",
          choices: ["ARP", "RARP", "ICMP", "DHCP"],
          correct: 1,
        },
        {
          question: "What does the Data Link layer frame?",
          choices: ["Packets", "Segments", "Data", "Bits"],
          correct: 2,
        },
      ],
      2: [
        // Network Implementations
        {
          question: "Which port does DHCP use for client requests?",
          choices: ["67", "68", "69", "70"],
          correct: 1,
        },
        {
          question: "What is the purpose of NAT?",
          choices: [
            "Encrypt data",
            "Translate addresses",
            "Route packets",
            "Filter traffic",
          ],
          correct: 1,
        },
        {
          question:
            "Which spanning tree protocol provides fastest convergence?",
          choices: ["STP", "RSTP", "PVST+", "MST"],
          correct: 1,
        },
        {
          question: "What does a trunk port carry?",
          choices: [
            "Single VLAN",
            "Multiple VLANs",
            "Management traffic",
            "Broadcast traffic",
          ],
          correct: 1,
        },
        {
          question: "Which routing protocol uses hop count as metric?",
          choices: ["OSPF", "RIP", "EIGRP", "BGP"],
          correct: 1,
        },
        {
          question: "What is the maximum number of VLANs in 802.1Q?",
          choices: ["1024", "2048", "4094", "4096"],
          correct: 2,
        },
        {
          question: "Which protocol synchronizes network time?",
          choices: ["SNTP", "NTP", "SMTP", "DHCP"],
          correct: 1,
        },
        {
          question: "What does EIGRP use for route calculation?",
          choices: ["Hop count", "Bandwidth", "DUAL algorithm", "Link state"],
          correct: 2,
        },
        {
          question: "Which VLAN carries untagged traffic?",
          choices: ["VLAN 0", "Native VLAN", "Management VLAN", "Trunk VLAN"],
          correct: 1,
        },
        {
          question: "What is the purpose of STP?",
          choices: [
            "Prevent loops",
            "Load balancing",
            "VLAN tagging",
            "Route calculation",
          ],
          correct: 0,
        },
      ],
      3: [
        // Network Operations
        {
          question: "Which SNMP version provides encryption?",
          choices: ["SNMPv1", "SNMPv2", "SNMPv2c", "SNMPv3"],
          correct: 3,
        },
        {
          question: "What does netstat -an display?",
          choices: [
            "ARP table",
            "DNS cache",
            "Active connections",
            "Routing table",
          ],
          correct: 2,
        },
        {
          question: "Which tool captures network packets?",
          choices: ["ping", "nslookup", "Wireshark", "telnet"],
          correct: 2,
        },
        {
          question: "What does bandwidth monitoring identify?",
          choices: [
            "Security threats",
            "Network utilization",
            "Hardware failures",
            "DNS issues",
          ],
          correct: 1,
        },
        {
          question: "Which log level indicates critical errors?",
          choices: ["Debug", "Info", "Warning", "Critical"],
          correct: 3,
        },
        {
          question: "What does the ping command test?",
          choices: ["Bandwidth", "Connectivity", "Security", "Routing"],
          correct: 1,
        },
        {
          question: "Which SNMP port receives traps?",
          choices: ["161", "162", "163", "164"],
          correct: 1,
        },
        {
          question: "What does traceroute show?",
          choices: ["Bandwidth", "Packet path", "DNS records", "MAC addresses"],
          correct: 1,
        },
        {
          question: "Which command displays ARP table?",
          choices: ["ipconfig", "arp -a", "netstat", "tracert"],
          correct: 1,
        },
        {
          question: "What does SNMP GET retrieve?",
          choices: ["Configuration", "MIB values", "Log files", "Certificates"],
          correct: 1,
        },
      ],
      4: [
        // Network Security
        {
          question: "Which encryption standard does WPA3 use?",
          choices: ["AES-128", "AES-192", "AES-256", "3DES"],
          correct: 2,
        },
        {
          question: "What does an IDS detect?",
          choices: [
            "Network congestion",
            "Intrusions",
            "Hardware failures",
            "Configuration errors",
          ],
          correct: 1,
        },
        {
          question: "Which authentication factor is 'something you know'?",
          choices: ["Fingerprint", "Password", "Smart card", "Retina scan"],
          correct: 1,
        },
        {
          question: "What does MAC filtering control?",
          choices: [
            "IP addresses",
            "Physical access",
            "Port numbers",
            "Domain names",
          ],
          correct: 1,
        },
        {
          question: "Which protocol provides secure file transfer?",
          choices: ["FTP", "TFTP", "SFTP", "HTTP"],
          correct: 2,
        },
        {
          question: "What does social engineering exploit?",
          choices: [
            "Software bugs",
            "Human psychology",
            "Network protocols",
            "Hardware flaws",
          ],
          correct: 1,
        },
        {
          question: "Which attack intercepts communications?",
          choices: [
            "DDoS",
            "Man-in-the-middle",
            "SQL injection",
            "Buffer overflow",
          ],
          correct: 1,
        },
        {
          question: "What does two-factor authentication require?",
          choices: [
            "One factor",
            "Two factors",
            "Three factors",
            "Multiple factors",
          ],
          correct: 1,
        },
        {
          question: "Which malware spreads without user action?",
          choices: ["Virus", "Worm", "Trojan", "Adware"],
          correct: 1,
        },
        {
          question: "What does a firewall's default policy determine?",
          choices: ["Speed", "Default action", "Port numbers", "IP addresses"],
          correct: 1,
        },
      ],
      5: [
        // Network Troubleshooting
        {
          question: "Which tool measures cable length?",
          choices: [
            "Multimeter",
            "TDR",
            "Protocol analyzer",
            "Spectrum analyzer",
          ],
          correct: 1,
        },
        {
          question: "What does limited connectivity indicate?",
          choices: [
            "Cable failure",
            "IP configuration issue",
            "Hardware failure",
            "Power issue",
          ],
          correct: 1,
        },
        {
          question: "Which LED indicates link activity?",
          choices: ["Power LED", "Status LED", "Activity LED", "Error LED"],
          correct: 2,
        },
        {
          question: "What does high latency suggest?",
          choices: [
            "Fast network",
            "Network delay",
            "Good performance",
            "Low utilization",
          ],
          correct: 1,
        },
        {
          question: "Which tool tests cable continuity?",
          choices: [
            "Cable tester",
            "Protocol analyzer",
            "Spectrum analyzer",
            "Network mapper",
          ],
          correct: 0,
        },
        {
          question: "What does packet loss indicate?",
          choices: [
            "Good performance",
            "Network problems",
            "Fast transmission",
            "Low latency",
          ],
          correct: 1,
        },
        {
          question: "Which device isolates network segments for testing?",
          choices: ["Hub", "Switch", "Router", "Loopback adapter"],
          correct: 3,
        },
        {
          question: "What does intermittent connectivity suggest?",
          choices: [
            "Stable connection",
            "Loose connection",
            "Fast network",
            "Good performance",
          ],
          correct: 1,
        },
        {
          question: "Which tool identifies cable faults?",
          choices: ["Ping", "TDR", "Telnet", "FTP"],
          correct: 1,
        },
        {
          question: "What does no link light indicate?",
          choices: [
            "Good connection",
            "Physical layer problem",
            "Fast transmission",
            "Normal operation",
          ],
          correct: 1,
        },
      ],
    };

    const base = baseQuestions[domainId] || [];
    const questionTemplates = domainQuestions[domainId] || [];
    const additional: Question[] = [];

    // Generate specific questions for this domain
    questionTemplates.forEach((questionData: QuestionTemplate, i: number) => {
      if (i + base.length < 50) {
        additional.push({
          id: domainId * 1000 + i + base.length,
          question: questionData.question,
          choices: questionData.choices,
          correct: questionData.correct,
          explanation: `This covers important Domain ${domainId} networking concepts.`,
          wrongExplanations: [
            (i + base.length) % 4 === 0
              ? null
              : "This option doesn't address the core networking requirement.",
            (i + base.length) % 4 === 1
              ? null
              : "This approach would not solve the networking issue effectively.",
            (i + base.length) % 4 === 2
              ? null
              : "This solution doesn't follow networking best practices.",
            (i + base.length) % 4 === 3
              ? null
              : "This method could cause additional network problems.",
          ],
          topic: `${domainId}.X — Generated question`,
        });
      }
    });

    // Use translated questions if available, otherwise fall back to hardcoded
    if (translatedQuestions.length > 0) {
      return translatedQuestions;
    }

    return [...base, ...additional];
  };

  // Create question pools for all domains
  const questionPools: Record<DomainId, Question[]> = {
    1: createQuestionPool(1),
    2: createQuestionPool(2),
    3: createQuestionPool(3),
    4: createQuestionPool(4),
    5: createQuestionPool(5),
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (sessionActive && !sessionComplete) {
      interval = setInterval(() => {
        setTimeElapsedState((prev: number) => {
          const newTime = prev + 1;
          // Update URL parameters with new time
          setQuizState({ timeElapsed: newTime });
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionActive, sessionComplete]);

  // Persist attempts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("comptia-attempts", JSON.stringify(attempts));
    } catch (error) {
      console.error("Error saving attempts to localStorage:", error);
    }
  }, [attempts]);

  // Persist domain pass status to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "comptia-domains-passed",
        JSON.stringify(domainsPassed)
      );
    } catch (error) {
      console.error("Error saving domains passed to localStorage:", error);
    }
  }, [domainsPassed]);

  // Persist current session progress to localStorage and URL parameters
  useEffect(() => {
    if (sessionActive && !sessionComplete) {
      try {
        const sessionData = {
          currentDomain,
          currentQuestion,
          score,
          timeElapsed,
          userAnswers,
          currentQuestions,
          selectedAnswer,
          sessionStartTime: Date.now(),
        };

        // Save to localStorage for fallback
        localStorage.setItem("comptia-session", JSON.stringify(sessionData));

        // Update URL parameters with current state
        setQuizState({
          domain: currentDomain,
          question: currentQuestion,
          score,
          timeElapsed,
          sessionActive,
          sessionComplete,
          showResults,
        });
      } catch (error) {
        console.error("Error saving session:", error);
      }
    } else {
      // Clear session data when session is not active
      localStorage.removeItem("comptia-session");

      // Clear URL parameters when session ends
      if (sessionComplete) {
        setQuizState({
          sessionActive: false,
          sessionComplete: true,
          showResults: true,
        }, true); // Replace history
      }
    }
  }, [
    sessionActive,
    sessionComplete,
    currentDomain,
    currentQuestion,
    score,
    timeElapsed,
    userAnswers,
    currentQuestions,
    selectedAnswer,
    showResults,
  ]);

  // Load session data on component mount - prioritize URL parameters over localStorage
  useEffect(() => {
    try {
      // First check if URL parameters exist
      if (hasQuizParams()) {
        const urlState = restoreStateFromURL();

        if (urlState.domain) setCurrentDomainState(urlState.domain as DomainId);
        if (urlState.question) setCurrentQuestionState(urlState.question);
        if (urlState.score !== undefined) setScoreState(urlState.score);
        if (urlState.timeElapsed !== undefined) setTimeElapsedState(urlState.timeElapsed);
        if (urlState.sessionActive !== undefined) setSessionActiveState(urlState.sessionActive);
        if (urlState.sessionComplete !== undefined) setSessionCompleteState(urlState.sessionComplete);
        if (urlState.showResults !== undefined) setShowResultsState(urlState.showResults);

        // Sync URL state to localStorage for fallback
        syncStateWithURL();

        // Show restoration notification if session is active
        if (urlState.sessionActive && urlState.question !== undefined) {
          setSessionRestored(true);
          setTimeout(() => setSessionRestored(false), 5000);
        }
      } else {
        // Fallback to localStorage if no URL parameters
        const savedSession = localStorage.getItem("comptia-session");
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          const sessionAge = Date.now() - (sessionData.sessionStartTime || 0);

          // Only restore session if it's less than 24 hours old
          if (sessionAge < 24 * 60 * 60 * 1000) {
            setCurrentDomain(sessionData.currentDomain || 1);
            setCurrentQuestion(sessionData.currentQuestion || 0);
            setScore(sessionData.score || 0);
            setTimeElapsed(sessionData.timeElapsed || 0);
            setUserAnswers(sessionData.userAnswers || []);
            setCurrentQuestions(sessionData.currentQuestions || []);
            setSelectedAnswer(sessionData.selectedAnswer || -1);

            // Only restore session if there are questions and we're not at the end
            if (
              sessionData.currentQuestions &&
              sessionData.currentQuestions.length > 0 &&
              sessionData.currentQuestion < sessionData.currentQuestions.length
            ) {
              setSessionActive(true);
              setSessionRestored(true);

              // Show notification for 5 seconds
              setTimeout(() => setSessionRestored(false), 5000);
            }
          } else {
            // Clear old session data
            localStorage.removeItem("comptia-session");
          }
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
      localStorage.removeItem("comptia-session");
    }
  }, []); // Only run on mount

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start new session
  const startSession = (domain: DomainId = currentDomain) => {
    const randomQuestions = shuffleArray(questionPools[domain]).slice(0, 50);
    setCurrentQuestions(randomQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setTimeElapsed(0);
    setUserAnswers([]);
    setSelectedAnswer(-1);
    setSessionActive(true);
    setSessionComplete(false);
    setShowResults(false);
    setShowDomainSelect(false);

    // Update URL parameters to reflect new session state
    setQuizState({
      domain,
      question: 0,
      score: 0,
      timeElapsed: 0,
      sessionActive: true,
      sessionComplete: false,
      showResults: false,
    }, true); // Replace history for new session
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  // Move to next question
  // Save & Exit function - allows students to exit and review their progress
  const saveAndExit = async () => {
    // Save current answer if one is selected
    if (selectedAnswer !== -1) {
      const isCorrect =
        selectedAnswer === currentQuestions[currentQuestion].correct;
      const newAnswers: UserAnswer[] = [
        ...userAnswers,
        {
          questionIndex: currentQuestion,
          selected: selectedAnswer,
          correct: isCorrect,
        },
      ];
      setUserAnswers(newAnswers);
      
      const newScore = isCorrect ? score + 1 : score;
      setScore(newScore);
      
      // Update state with current progress
      setQuizState({
        score: newScore,
        question: currentQuestion + 1,
      });
    }

    // Show results/review screen without marking session as complete
    setSessionActive(false);
    setShowResults(true);
    
    // Update URL to show results
    setQuizState({
      showResults: true,
      sessionActive: false,
    });
  };

  const nextQuestion = async () => {
    const isCorrect =
      selectedAnswer === currentQuestions[currentQuestion].correct;
    const newAnswers: UserAnswer[] = [
      ...userAnswers,
      {
        questionIndex: currentQuestion,
        selected: selectedAnswer,
        correct: isCorrect,
      },
    ];
    setUserAnswers(newAnswers);

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion + 1 < currentQuestions.length) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setSelectedAnswer(-1);

      // Update URL parameters for next question
      setQuizState({
        question: nextQuestionIndex,
        score: newScore,
      });
    } else {
      // Session complete
      setSessionActive(false);
      setSessionComplete(true);
      setShowResults(true);

      const finalScore = newScore;
      const passed = finalScore / currentQuestions.length >= 0.7;

      // Save attempt locally
      const newAttempt: Attempt = {
        date: new Date().toLocaleString(),
        score: finalScore,
        total: currentQuestions.length,
        duration: timeElapsed,
        passed: passed,
      };

      setAttempts((prev) => ({
        ...prev,
        [currentDomain]: [...prev[currentDomain], newAttempt],
      }));

      // Update domain pass status locally
      if (passed) {
        setDomainsPassed((prev) => ({ ...prev, [currentDomain]: true }));
      }

      // Update URL parameters for completed session
      setQuizState({
        score: finalScore,
        sessionActive: false,
        sessionComplete: true,
        showResults: true,
      }, true); // Replace history for completed session

      // Test results are saved locally in attempts array (see above)
    }
  };

  // Change domain
  const changeDomain = (domain: DomainId) => {
    // If session is active, confirm before switching
    if (sessionActive) {
      const confirmSwitch = window.confirm(
        t('quiz:session.confirmDomainSwitch', {
          defaultValue: 'You have an active session. Switching domains will end your current session. Continue?'
        })
      );
      if (!confirmSwitch) {
        setShowDomainSelect(false);
        return;
      }
    }

    setCurrentDomain(domain);
    setSessionActive(false);
    setSessionComplete(false);
    setShowResults(false);
    setShowDomainSelect(false);

    // Update URL parameters for domain change
    setQuizState({
      domain,
      sessionActive: false,
      sessionComplete: false,
      showResults: false,
    }, true); // Replace history for domain change
  };

  // Get domain color classes
  const getDomainColor = (domain: DomainId): string => {
    const colors: Record<string, string> = {
      blue: "text-blue-400 border-blue-500",
      green: "text-green-400 border-green-500",
      yellow: "text-yellow-400 border-yellow-500",
      red: "text-red-400 border-red-500",
      purple: "text-purple-400 border-purple-500",
    };
    return colors[domains[domain].color];
  };

  // Results component
  const ResultsScreen = () => {
    const finalScore = score;
    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 mb-6">
            <div className="text-center mb-8">
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              )}
              <h2 className="text-3xl font-bold mb-2">
                {passed ? t('quiz:results.congratulations') : t('quiz:results.keepStudying')}
              </h2>
              <p className="text-gray-300">
                {passed
                  ? t('quiz:results.passedDomain', { domain: currentDomain })
                  : t('quiz:results.need70Percent', { nextDomain: currentDomain + 1 })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {finalScore}/{totalQuestions}
                </div>
                <div className="text-gray-300">{t('quiz:results.questionsCorrect')}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div
                  className={`text-2xl font-bold ${passed ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {percentage}%
                </div>
                <div className="text-gray-300">{t('quiz:results.finalScore')}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-gray-300">{t('quiz:results.timeTaken')}</div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {passed ? (
                currentDomain < 5 ? (
                  <button
                    onClick={() =>
                      changeDomain((currentDomain + 1) as DomainId)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                  >
                    {t('quiz:results.advanceToNext', { domain: currentDomain + 1 })}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-center">
                    <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                      {t('quiz:results.certificationReady')}
                    </h3>
                    <p className="text-gray-300">
                      {t('quiz:results.masteredAllDomains')}
                    </p>
                  </div>
                )
              ) : (
                <button
                  onClick={() => startSession(currentDomain)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  {t('quiz:results.retryDomain', { domain: currentDomain })}
                </button>
              )}
              <button
                onClick={() => setShowResults(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                {t('common:buttons.backToDashboard')}
              </button>
            </div>
          </div>

          {/* Wrong Answer Explanations */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-6 text-red-400">
              {t('quiz:results.reviewIncorrect')}
            </h3>

            {userAnswers.filter((answer) => !answer.correct).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-400 text-lg font-semibold">
                  {t('quiz:results.perfectScore')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userAnswers
                  .filter((answer) => !answer.correct)
                  .map((answer, index) => {
                    const question = currentQuestions[answer.questionIndex];
                    const wrongExplanation =
                      question.wrongExplanations[answer.selected];

                    return (
                      <div
                        key={index}
                        className="border border-red-500/30 rounded-lg p-6 bg-red-500/5"
                      >
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-2">
                            Question {answer.questionIndex + 1}:{" "}
                            {question.question}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {question.topic}
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="text-red-400 mb-2">
                            <strong>{t('quiz:results.yourAnswer')}:</strong>{" "}
                            {question.choices[answer.selected]}
                          </p>
                        </div>

                        <div className="bg-gray-700 rounded-lg p-4">
                          <p className="text-yellow-300 font-semibold mb-2">
                            {t('quiz:results.whyIncorrect')}
                          </p>
                          <p className="text-gray-300">{wrongExplanation}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (showResults) {
    return <ResultsScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white ">
      {/* Header */}
      <div className="bg-gray-800 lg:p-6 p-4 space-y-10">
        <div className="flex justify-between items-start mb-4 lg:flex-row flex-col-reverse gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold">
                {t('quiz:domain')} {currentDomain} — {domains[currentDomain].name}
              </h1>
            </div>
            <p className="text-gray-300">
              {t('quiz:session.sequentialMastery')}
            </p>
          </div>

          {/* DigitalEdge Branding & Support */}
          <div className="flex items-center gap-4 justify-between lg:w-auto w-full">
            <div className="flex flex-col lg:items-end items-start lg:ml-6 gap-10">
              <div>
                <Logo size="lg" />
                <div className="text-xs text-blue-400">
                  Powered by DigitalEdge
                </div>
              </div>
              <SupportBanner compact />
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitch />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-4 lg:flex-row flex-col w-full">
            <div className="relative lg:w-[200px] w-full domain-selector">
              <button
                onClick={() => setShowDomainSelect(!showDomainSelect)}
                className={`px-3 py-1 rounded border w-full flex items-center justify-center gap-2 ${getDomainColor(
                  currentDomain
                )} hover:bg-gray-700 cursor-pointer`}
              >
                <span>{t('common:labels.currentDomain')}: {currentDomain}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDomainSelect ? 'rotate-180' : ''}`} />
              </button>
              {showDomainSelect && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[250px] bg-gray-700 rounded-lg shadow-2xl border border-gray-600 z-50">
                  {([1, 2, 3, 4, 5] as DomainId[]).map((domainId) => (
                    <button
                      key={domainId}
                      onClick={() => changeDomain(domainId)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-gray-600 last:border-b-0 ${currentDomain === domainId ? 'bg-gray-600' : ''
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{t('quiz:domain')} {domainId}</div>
                          <div className="text-xs text-gray-400">{domains[domainId].name}</div>
                        </div>
                        {domainsPassed[domainId] && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!sessionActive && (
              <button
                onClick={() => startSession()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold lg:w-[200px] w-full"
              >
                {t('common:buttons.startSession')}
              </button>
            )}
            <p className="text-gray-300 lg:w-[200px] w-full text-center">
              {t('common:labels.questionsPerSession')}
            </p>
          </div>
        </div>

      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            {sessionActive && currentQuestions.length > 0 ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-300">
                    Q {currentQuestion + 1}/{currentQuestions.length}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{t('quiz:demo.timeLabel')} {formatTime(timeElapsed)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{t('quiz:demo.scoreLabel')} {score}</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-6">
                  {currentQuestions[currentQuestion]?.question}
                </h2>

                <div className="space-y-3 mb-6">
                  {currentQuestions[currentQuestion]?.choices.map(
                    (choice, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedAnswer === index
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                          }`}
                      >
                        {choice}
                      </button>
                    )
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {currentQuestions[currentQuestion]?.topic}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={saveAndExit}
                      className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold transition-colors"
                      title="Save your progress and exit to review"
                    >
                      Save & Exit
                    </button>
                    <button
                      onClick={nextQuestion}
                      disabled={selectedAnswer === -1}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded font-semibold"
                    >
                      {currentQuestion + 1 === currentQuestions.length
                        ? t('quiz:demo.finish')
                        : t('quiz:demo.next')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  {t('quiz:session.readyToTest', { domain: currentDomain })}
                </h2>
                <p className="text-gray-300 mb-6">
                  {t('quiz:session.sessionDescription', { domainName: domains[currentDomain].name })}
                </p>
                <button
                  onClick={() => startSession()}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  {t('quiz:session.beginTest', { domain: currentDomain })}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attempts History */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('quiz:attempts.title', { domain: currentDomain })}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {t('quiz:attempts.savedLocally')}
              </p>

              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
                  <span>#</span>
                  <span>{t('quiz:attempts.headers.date')}</span>
                  <span>{t('quiz:attempts.headers.score')}</span>
                  <span>{t('quiz:attempts.headers.duration')}</span>
                </div>

                {attempts[currentDomain].length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    {t('quiz:attempts.noAttempts')}
                  </div>
                ) : (
                  attempts[currentDomain].map((attempt, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-sm">
                      <span>{index + 1}</span>
                      <span className="text-xs">
                        {attempt.date.split(",")[0]}
                      </span>
                      <span
                        className={
                          attempt.passed ? "text-green-400" : "text-red-400"
                        }
                      >
                        {attempt.score}/{attempt.total} (
                        {Math.round((attempt.score / attempt.total) * 100)}%)
                      </span>
                      <span>{formatTime(attempt.duration)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Question Pool Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{t('quiz:questionPool.title')}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {t('quiz:questionPool.description')}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('quiz:questionPool.poolSize')}:</span>
                  <span className="text-blue-400">
                    {questionPools[currentDomain].length} {t('quiz:session.questions')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('quiz:questionPool.perSession')}:</span>
                  <span className="text-blue-400">{t('quiz:questionPool.perSessionValue')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('quiz:questionPool.passThreshold')}:</span>
                  <span className="text-green-400">{t('quiz:questionPool.passThresholdValue')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center lg:flex-row flex-col gap-4">
          <div className="text-sm text-gray-400">
            {t('dashboard:system.title')}
          </div>
          <div className="flex items-center gap-4 lg:flex-row flex-col-reverse">
            <SupportBanner compact />
            <div className="flex items-center gap-2">
              <div className="text-sm text-blue-400">Powered by</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded flex items-center justify-center">
                  <div className="text-white font-bold text-xs">D</div>
                </div>
                <div className="text-sm font-semibold">
                  <span className="text-orange-400">DIGITAL</span>
                  <span className="text-blue-400">EDGE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessScreen;
