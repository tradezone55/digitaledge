// networkQuestions.ts
// Complete CompTIA Network+ Question Bank - 210 Questions

export interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  wrongExplanations: (string | null)[];
  topic: string;
}

export type DomainId = 1 | 2 | 3 | 4 | 5;

export const questionBank: Record<DomainId, Question[]> = {
  1: [
    {
      id: 1,
      question: "Which OSI layer is responsible for logical addressing?",
      choices: ["Data Link", "Network", "Transport", "Session"],
      correct: 1,
      explanation: "The Network layer (Layer 3) handles logical addressing using IP addresses and routing between networks.",
      wrongExplanations: [
        "Data Link layer uses physical MAC addresses.",
        null,
        "Transport layer handles port numbers and segmentation.",
        "Session layer manages connections between applications."
      ],
      topic: "1.1 — OSI Model"
    },
    {
      id: 2,
      question: "What is the primary function of the OSI Physical layer?",
      choices: [
        "Routing packets",
        "Transmitting raw bits over physical medium",
        "Error detection",
        "Session management"
      ],
      correct: 1,
      explanation: "The Physical layer (Layer 1) transmits raw binary data (bits) over the physical medium such as cables or wireless.",
      wrongExplanations: [
        "Routing occurs at the Network layer.",
        null,
        "Error detection happens at the Data Link layer.",
        "Session management is handled by the Session layer."
      ],
      topic: "1.1 — Physical Layer"
    },
    {
      id: 3,
      question: "Which device operates at Layer 2 of the OSI model?",
      choices: ["Router", "Switch", "Hub", "Repeater"],
      correct: 1,
      explanation: "Switches operate at Layer 2 (Data Link), using MAC addresses to forward frames within a local network.",
      wrongExplanations: [
        "Routers operate at Layer 3 using IP addresses.",
        null,
        "Hubs operate at Layer 1, simply repeating signals.",
        "Repeaters operate at Layer 1, amplifying signals."
      ],
      topic: "1.2 — Network Devices"
    },
    {
      id: 4,
      question: "What does TCP provide that UDP does not?",
      choices: [
        "Faster transmission",
        "Guaranteed delivery and error checking",
        "Lower overhead",
        "Broadcasting capability"
      ],
      correct: 1,
      explanation: "TCP provides reliable, connection-oriented communication with guaranteed delivery, error checking, and retransmission of lost packets.",
      wrongExplanations: [
        "UDP is actually faster due to less overhead.",
        null,
        "TCP has higher overhead than UDP due to reliability features.",
        "Neither TCP nor UDP inherently supports broadcasting; that's a network layer feature."
      ],
      topic: "1.3 — TCP vs UDP"
    },
    {
      id: 5,
      question: "Which cable type uses light pulses for data transmission?",
      choices: ["Coaxial", "Twisted pair", "Fiber optic", "Serial"],
      correct: 2,
      explanation: "Fiber optic cables transmit data using light pulses through glass or plastic fibers, providing high speed and long-distance capability.",
      wrongExplanations: [
        "Coaxial uses electrical signals over copper.",
        "Twisted pair uses electrical signals over copper wires.",
        null,
        "Serial cables use electrical signals."
      ],
      topic: "1.4 — Cable Types"
    },
    {
      id: 6,
      question: "What is the maximum cable length for 100BASE-TX Ethernet?",
      choices: ["50 meters", "100 meters", "185 meters", "500 meters"],
      correct: 1,
      explanation: "100BASE-TX (Fast Ethernet over twisted pair) has a maximum cable length of 100 meters per segment.",
      wrongExplanations: [
        "50 meters is not a standard Ethernet cable length limit.",
        null,
        "185 meters is the limit for 10BASE2 (thin coax).",
        "500 meters is the limit for 10BASE5 (thick coax)."
      ],
      topic: "1.4 — Ethernet Standards"
    },
    {
      id: 7,
      question: "Which connector is used for Ethernet twisted pair cables?",
      choices: ["RJ-11", "RJ-45", "BNC", "ST"],
      correct: 1,
      explanation: "RJ-45 connectors are used for Ethernet twisted pair cables (Cat5, Cat5e, Cat6, etc.).",
      wrongExplanations: [
        "RJ-11 is used for telephone connections.",
        null,
        "BNC is used for coaxial cables.",
        "ST is a fiber optic connector."
      ],
      topic: "1.4 — Network Connectors"
    },
    {
      id: 8,
      question: "What is the function of a router?",
      choices: [
        "Connect devices in a LAN",
        "Forward packets between different networks",
        "Amplify signals",
        "Provide wireless access"
      ],
      correct: 1,
      explanation: "Routers operate at Layer 3 and forward packets between different networks based on IP addresses.",
      wrongExplanations: [
        "Switches connect devices in a LAN.",
        null,
        "Repeaters and hubs amplify signals.",
        "Wireless access points provide wireless access."
      ],
      topic: "1.2 — Network Devices"
    },
    {
      id: 9,
      question: "Which private IP address range belongs to Class A?",
      choices: [
        "10.0.0.0 to 10.255.255.255",
        "172.16.0.0 to 172.31.255.255",
        "192.168.0.0 to 192.168.255.255",
        "127.0.0.0 to 127.255.255.255"
      ],
      correct: 0,
      explanation: "The 10.0.0.0/8 range (10.0.0.0 to 10.255.255.255) is the Class A private address range defined in RFC 1918.",
      wrongExplanations: [
        null,
        "This is the Class B private address range.",
        "This is the Class C private address range.",
        "This is the loopback address range, not a private range."
      ],
      topic: "1.6 — Private IP Ranges"
    },
    {
      id: 10,
      question: "What does DNS do?",
      choices: [
        "Assigns IP addresses automatically",
        "Resolves domain names to IP addresses",
        "Encrypts network traffic",
        "Routes packets between networks"
      ],
      correct: 1,
      explanation: "DNS (Domain Name System) translates human-readable domain names (like www.example.com) into IP addresses.",
      wrongExplanations: [
        "DHCP assigns IP addresses automatically.",
        null,
        "VPNs and protocols like TLS encrypt network traffic.",
        "Routers route packets between networks."
      ],
      topic: "1.3 — DNS"
    },
    {
      id: 11,
      question: "Which protocol automatically assigns IP addresses to devices?",
      choices: ["DNS", "DHCP", "ARP", "ICMP"],
      correct: 1,
      explanation: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, gateways, and DNS servers to devices.",
      wrongExplanations: [
        "DNS resolves domain names to IP addresses.",
        null,
        "ARP resolves IP addresses to MAC addresses.",
        "ICMP is used for error messages and diagnostics."
      ],
      topic: "1.3 — DHCP"
    },
    {
      id: 12,
      question: "What is the primary purpose of ARP?",
      choices: [
        "Resolve IP addresses to MAC addresses",
        "Resolve domain names to IP addresses",
        "Assign IP addresses",
        "Route packets"
      ],
      correct: 0,
      explanation: "ARP (Address Resolution Protocol) resolves IP addresses to MAC addresses for communication within a local network.",
      wrongExplanations: [
        null,
        "DNS resolves domain names to IP addresses.",
        "DHCP assigns IP addresses.",
        "Routers route packets based on IP addresses."
      ],
      topic: "1.3 — ARP"
    },
    {
      id: 13,
      question: "Which protocol is used for sending email?",
      choices: ["POP3", "IMAP", "SMTP", "HTTP"],
      correct: 2,
      explanation: "SMTP (Simple Mail Transfer Protocol) is used for sending email from clients to servers and between mail servers.",
      wrongExplanations: [
        "POP3 is used for retrieving email.",
        "IMAP is used for retrieving and managing email on servers.",
        null,
        "HTTP is used for web browsing."
      ],
      topic: "1.3 — Email Protocols"
    },
    {
      id: 14,
      question: "What is the purpose of a default gateway?",
      choices: [
        "Assign IP addresses",
        "Route traffic to other networks",
        "Resolve domain names",
        "Provide wireless access"
      ],
      correct: 1,
      explanation: "The default gateway is a router that forwards traffic destined for networks outside the local subnet.",
      wrongExplanations: [
        "DHCP servers assign IP addresses.",
        null,
        "DNS servers resolve domain names.",
        "Access points provide wireless access."
      ],
      topic: "1.6 — IP Configuration"
    },
    {
      id: 15,
      question: "Which protocol operates at the Transport layer?",
      choices: ["IP", "TCP", "Ethernet", "ARP"],
      correct: 1,
      explanation: "TCP (and UDP) operate at the Transport layer (Layer 4), providing end-to-end communication services.",
      wrongExplanations: [
        "IP operates at the Network layer (Layer 3).",
        null,
        "Ethernet operates at the Data Link layer (Layer 2).",
        "ARP operates between Network and Data Link layers."
      ],
      topic: "1.1 — Protocol Layers"
    },
    {
      id: 16,
      question: "What does CSMA/CD stand for?",
      choices: [
        "Carrier Sense Multiple Access with Collision Detection",
        "Central System Multiple Access Control Device",
        "Computer System Management and Control Data",
        "Carrier Signal Modulation Access Control Data"
      ],
      correct: 0,
      explanation: "CSMA/CD is Carrier Sense Multiple Access with Collision Detection, used in early Ethernet to manage shared media access.",
      wrongExplanations: [
        null,
        "This is not a real networking term.",
        "This is not a real networking term.",
        "This is not a real networking term."
      ],
      topic: "1.3 — Media Access Control"
    },
    {
      id: 17,
      question: "How many bits are in an IPv4 address?",
      choices: ["16", "32", "64", "128"],
      correct: 1,
      explanation: "IPv4 addresses are 32 bits long, typically written as four octets in dotted decimal notation (e.g., 192.168.1.1).",
      wrongExplanations: [
        "16 bits is too small for IPv4.",
        null,
        "64 bits is used in some contexts but not for IPv4 addresses.",
        "128 bits is the length of IPv6 addresses."
      ],
      topic: "1.6 — IPv4 Addressing"
    },
    {
      id: 18,
      question: "How many bits are in an IPv6 address?",
      choices: ["32", "64", "96", "128"],
      correct: 3,
      explanation: "IPv6 addresses are 128 bits long, written in hexadecimal notation (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334).",
      wrongExplanations: [
        "32 bits is the length of IPv4 addresses.",
        "64 bits is used for interface identifiers in IPv6.",
        "96 bits is not a standard address length.",
        null
      ],
      topic: "1.6 — IPv6 Addressing"
    },
    {
      id: 19,
      question: "What is the primary advantage of fiber optic cable over copper?",
      choices: [
        "Easier to install",
        "Immune to electromagnetic interference and longer distances",
        "Lower cost",
        "Smaller connectors"
      ],
      correct: 1,
      explanation: "Fiber optic cables are immune to EMI and can transmit data over much longer distances without signal degradation.",
      wrongExplanations: [
        "Fiber is more difficult to install than copper.",
        null,
        "Fiber is generally more expensive than copper.",
        "Fiber connectors are typically larger than copper RJ-45 connectors."
      ],
      topic: "1.4 — Cable Advantages"
    },
    {
      id: 20,
      question: "What is a subnet mask used for?",
      choices: [
        "Encrypt network traffic",
        "Divide IP addresses into network and host portions",
        "Resolve domain names",
        "Assign IP addresses"
      ],
      correct: 1,
      explanation: "A subnet mask determines which portion of an IP address is the network portion and which is the host portion.",
      wrongExplanations: [
        "VPNs and encryption protocols encrypt traffic.",
        null,
        "DNS servers resolve domain names.",
        "DHCP servers assign IP addresses."
      ],
      topic: "1.6 — Subnetting"
    },
    {
      id: 21,
      question: "Which network type spans a city or metropolitan area?",
      choices: ["PAN", "LAN", "MAN", "WAN"],
      correct: 2,
      explanation: "MAN (Metropolitan Area Network) spans a city or metropolitan area, larger than a LAN but smaller than a WAN.",
      wrongExplanations: [
        "PAN (Personal Area Network) covers a very small area around a person.",
        "LAN (Local Area Network) covers a building or campus.",
        null,
        "WAN (Wide Area Network) spans large geographic areas like countries."
      ],
      topic: "1.5 — Network Types"
    },
    {
      id: 22,
      question: "What is the purpose of the Session layer?",
      choices: [
        "Physical transmission of bits",
        "Managing and controlling connections between applications",
        "Routing packets",
        "Data encryption"
      ],
      correct: 1,
      explanation: "The Session layer (Layer 5) establishes, manages, and terminates connections (sessions) between applications.",
      wrongExplanations: [
        "Physical layer handles physical transmission.",
        null,
        "Network layer handles routing.",
        "Presentation layer handles encryption."
      ],
      topic: "1.1 — Session Layer"
    },
    {
      id: 23,
      question: "What is the broadcast address for the network 192.168.10.0/24?",
      choices: [
        "192.168.10.0",
        "192.168.10.1",
        "192.168.10.254",
        "192.168.10.255"
      ],
      correct: 3,
      explanation: "The broadcast address for a /24 network is the last address in the range, where all host bits are set to 1 (192.168.10.255).",
      wrongExplanations: [
        "This is the network address, not the broadcast address.",
        "This is typically the default gateway address.",
        "This could be a host address, not the broadcast address.",
        null
      ],
      topic: "1.6 — IP Addressing"
    },
    {
      id: 24,
      question: "Which OSI layer handles encryption?",
      choices: ["Transport", "Session", "Presentation", "Application"],
      correct: 2,
      explanation: "The Presentation layer (Layer 6) handles data encryption, decryption, compression, and format translation.",
      wrongExplanations: [
        "Transport layer handles segmentation and reliability.",
        "Session layer manages connections between applications.",
        null,
        "Application layer provides network services to applications."
      ],
      topic: "1.1 — Presentation Layer"
    },
    {
      id: 25,
      question: "What is a MAC address?",
      choices: [
        "A logical network address",
        "A 48-bit physical hardware address",
        "An IPv6 address format",
        "A DNS record type"
      ],
      correct: 1,
      explanation: "A MAC (Media Access Control) address is a 48-bit (6 bytes) physical hardware address burned into network interface cards.",
      wrongExplanations: [
        "Logical addresses are IP addresses.",
        null,
        "IPv6 addresses are 128-bit logical addresses.",
        "MAC addresses are not DNS records."
      ],
      topic: "1.2 — MAC Addresses"
    },
    {
      id: 26,
      question: "Which port number does HTTP use by default?",
      choices: ["21", "23", "80", "443"],
      correct: 2,
      explanation: "HTTP (Hypertext Transfer Protocol) uses TCP port 80 by default for unencrypted web traffic.",
      wrongExplanations: [
        "Port 21 is used by FTP.",
        "Port 23 is used by Telnet.",
        null,
        "Port 443 is used by HTTPS (encrypted HTTP)."
      ],
      topic: "1.3 — Common Ports"
    },
    {
      id: 27,
      question: "What does HTTPS use for encryption?",
      choices: ["IPsec", "TLS/SSL", "WPA2", "AES"],
      correct: 1,
      explanation: "HTTPS uses TLS (Transport Layer Security) or its predecessor SSL to encrypt web traffic between browser and server.",
      wrongExplanations: [
        "IPsec is used for VPNs and network layer encryption.",
        null,
        "WPA2 is used for wireless network encryption.",
        "AES is an encryption algorithm, not a protocol."
      ],
      topic: "1.3 — Security Protocols"
    },
    {
      id: 28,
      question: "Which network topology provides the highest redundancy?",
      choices: ["Bus", "Star", "Ring", "Full mesh"],
      correct: 3,
      explanation: "Full mesh topology has every device connected to every other device, providing maximum redundancy and multiple paths.",
      wrongExplanations: [
        "Bus topology has no redundancy; a cable break affects the network.",
        "Star topology has a single point of failure (the central device).",
        "Ring topology has limited redundancy unless dual rings are used.",
        null
      ],
      topic: "1.5 — Network Topologies"
    },
    {
      id: 29,
      question: "What is the purpose of a crossover cable?",
      choices: [
        "Connect a computer to a switch",
        "Connect two similar devices directly",
        "Extend cable length",
        "Provide PoE power"
      ],
      correct: 1,
      explanation: "Crossover cables connect two similar devices (like two computers or two switches) directly without a switch or hub in between.",
      wrongExplanations: [
        "Straight-through cables connect computers to switches.",
        null,
        "Repeaters or media converters extend cable length.",
        "PoE injectors or PoE switches provide power."
      ],
      topic: "1.4 — Cable Types"
    },
    {
      id: 30,
      question: "How many usable host addresses are in a /30 subnet?",
      choices: ["1", "2", "4", "6"],
      correct: 1,
      explanation: "A /30 subnet has 4 total addresses, but only 2 are usable (network and broadcast addresses are not usable for hosts).",
      wrongExplanations: [
        "1 address would be insufficient for a network connection.",
        null,
        "4 is the total addresses, not usable hosts.",
        "6 addresses would require a /29 subnet."
      ],
      topic: "1.6 — Subnetting"
    },
    {
      id: 31,
      question: "Which protocol is connectionless?",
      choices: ["TCP", "UDP", "FTP", "HTTP"],
      correct: 1,
      explanation: "UDP (User Datagram Protocol) is connectionless, meaning it sends data without establishing a connection or guaranteeing delivery.",
      wrongExplanations: [
        "TCP is connection-oriented.",
        null,
        "FTP uses TCP and is connection-oriented.",
        "HTTP typically uses TCP and is connection-oriented."
      ],
      topic: "1.3 — Transport Protocols"
    },
    {
      id: 32,
      question: "What is the loopback address in IPv4?",
      choices: ["0.0.0.0", "127.0.0.1", "192.168.1.1", "255.255.255.255"],
      correct: 1,
      explanation: "127.0.0.1 (or any address in the 127.0.0.0/8 range) is the loopback address used to test the local network stack.",
      wrongExplanations: [
        "0.0.0.0 represents all addresses or an unknown address.",
        null,
        "192.168.1.1 is a common private IP address.",
        "255.255.255.255 is the limited broadcast address."
      ],
      topic: "1.6 — Special IP Addresses"
    },
    {
      id: 33,
      question: "Which layer of the TCP/IP model corresponds to OSI Layers 5-7?",
      choices: ["Network Access", "Internet", "Transport", "Application"],
      correct: 3,
      explanation: "The TCP/IP Application layer combines the functionality of the OSI Session, Presentation, and Application layers (5-7).",
      wrongExplanations: [
        "Network Access corresponds to OSI Layers 1-2.",
        "Internet corresponds to OSI Layer 3.",
        "Transport corresponds to OSI Layer 4.",
        null
      ],
      topic: "1.1 — TCP/IP Model"
    },
    {
      id: 34,
      question: "What is the maximum transmission speed of 100BASE-TX?",
      choices: ["10 Mbps", "100 Mbps", "1000 Mbps", "10 Gbps"],
      correct: 1,
      explanation: "100BASE-TX (Fast Ethernet) provides transmission speeds of 100 Mbps (megabits per second).",
      wrongExplanations: [
        "10 Mbps is the speed of 10BASE-T.",
        null,
        "1000 Mbps (1 Gbps) is the speed of 1000BASE-T.",
        "10 Gbps is the speed of 10GBASE-T."
      ],
      topic: "1.4 — Ethernet Standards"
    },
    {
      id: 35,
      question: "Which type of fiber uses a single ray of light?",
      choices: [
        "Multimode fiber",
        "Single-mode fiber",
        "Coaxial fiber",
        "Hybrid fiber"
      ],
      correct: 1,
      explanation: "Single-mode fiber uses a single ray (mode) of light and is capable of longer distances and higher bandwidth than multimode.",
      wrongExplanations: [
        "Multimode fiber uses multiple rays of light.",
        null,
        "Coaxial is a copper cable type, not fiber.",
        "Hybrid fiber is not a standard term for fiber types."
      ],
      topic: "1.4 — Fiber Optic Types"
    },
    {
      id: 36,
      question: "What does the acronym VLAN stand for?",
      choices: [
        "Virtual Local Area Network",
        "Very Large Area Network",
        "Variable Length Address Network",
        "Verified LAN"
      ],
      correct: 0,
      explanation: "VLAN stands for Virtual Local Area Network, which logically segments a physical network into separate broadcast domains.",
      wrongExplanations: [
        null,
        "This is not the correct expansion of VLAN.",
        "This is not the correct expansion of VLAN.",
        "This is not the correct expansion of VLAN."
      ],
      topic: "1.5 — Network Segmentation"
    },
    {
      id: 37,
      question: "Which device operates at Layer 1 and simply repeats signals?",
      choices: ["Switch", "Router", "Hub", "Bridge"],
      correct: 2,
      explanation: "A hub operates at Layer 1 (Physical layer) and simply repeats incoming signals to all ports without any intelligence.",
      wrongExplanations: [
        "Switches operate at Layer 2 using MAC addresses.",
        "Routers operate at Layer 3 using IP addresses.",
        null,
        "Bridges operate at Layer 2 and filter traffic."
      ],
      topic: "1.2 — Network Devices"
    },
    {
      id: 38,
      question: "What is the standard MTU size for Ethernet?",
      choices: ["576 bytes", "1280 bytes", "1500 bytes", "9000 bytes"],
      correct: 2,
      explanation: "The standard Maximum Transmission Unit (MTU) for Ethernet is 1500 bytes for the data payload.",
      wrongExplanations: [
        "576 bytes is the minimum reassembly buffer size for IPv4.",
        "1280 bytes is the minimum MTU for IPv6.",
        null,
        "9000 bytes is a jumbo frame size, not standard Ethernet."
      ],
      topic: "1.3 — Ethernet Frame"
    },
    {
      id: 39,
      question: "Which protocol resolves domain names to IP addresses?",
      choices: ["DHCP", "DNS", "ARP", "ICMP"],
      correct: 1,
      explanation: "DNS (Domain Name System) resolves human-readable domain names (like www.example.com) to IP addresses.",
      wrongExplanations: [
        "DHCP assigns IP addresses to devices.",
        null,
        "ARP resolves IP addresses to MAC addresses.",
        "ICMP is used for error messages and diagnostics (like ping)."
      ],
      topic: "1.3 — Application Protocols"
    },
    {
      id: 40,
      question: "What is the purpose of port numbers in TCP/IP?",
      choices: [
        "Identify physical network ports",
        "Identify specific applications or services",
        "Provide security",
        "Determine routing paths"
      ],
      correct: 1,
      explanation: "Port numbers identify specific applications or services on a host, allowing multiple services to run on a single IP address.",
      wrongExplanations: [
        "Physical ports are different from logical port numbers.",
        null,
        "While some security involves ports, that's not their primary purpose.",
        "Routing uses IP addresses, not port numbers."
      ],
      topic: "1.3 — Port Numbers"
    }
  ],
  2: [
    // PASTE DOMAIN 2 QUESTIONS HERE
  ],
  3: [
    // Domain 3 questions will go here
  ],
  4: [
    // Domain 4 questions will go here
  ],
  5: [
    // Domain 5 questions will go here
  ],
};

export const getQuestionsForDomain = (domainId: DomainId): Question[] => {
  return questionBank[domainId] || [];
};

export const getRandomQuestions = (domainId: DomainId, count: number): Question[] => {
  const questions = getQuestionsForDomain(domainId);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};
