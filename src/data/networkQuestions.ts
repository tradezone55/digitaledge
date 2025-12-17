// questionBanketworkQuestions.ts
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
    {
      id: 41,
      question: "What is the primary purpose of a router?",
      choices: [
        "Connect devices in the same network",
        "Forward packets between different networks",
        "Filter MAC addresses",
        "Amplify signals"
      ],
      correct: 1,
      explanation: "Routers forward packets between different networks using IP addresses and routing tables, operating at Layer 3 of the OSI model.",
      wrongExplanations: [
        "Switches connect devices in the same network.",
        null,
        "Switches filter based on MAC addresses at Layer 2.",
        "Repeaters and amplifiers boost signals at Layer 1."
      ],
      topic: "2.1 — Routers"
    },
    {
      id: 42,
      question: "Which routing protocol is considered a hybrid protocol?",
      choices: ["RIP", "OSPF", "EIGRP", "BGP"],
      correct: 2,
      explanation: "EIGRP (Enhanced Interior Gateway Routing Protocol) is considered a hybrid protocol, combining features of both distance-vector and link-state protocols.",
      wrongExplanations: [
        "RIP is a pure distance-vector protocol.",
        "OSPF is a pure link-state protocol.",
        null,
        "BGP is a path-vector protocol."
      ],
      topic: "2.2 — EIGRP"
    },
    {
      id: 43,
      question: "What does STP prevent?",
      choices: [
        "Routing loops",
        "Switching loops",
        "IP conflicts",
        "DNS failures"
      ],
      correct: 1,
      explanation: "STP (Spanning Tree Protocol) prevents switching loops in networks with redundant Layer 2 paths by blocking redundant links.",
      wrongExplanations: [
        "Routing loops are prevented by routing protocols like split horizon.",
        null,
        "IP conflicts are prevented by DHCP or proper IP management.",
        "DNS failures are addressed by redundant DNS servers."
      ],
      topic: "2.3 — STP"
    },
    {
      id: 44,
      question: "What is a VLAN?",
      choices: [
        "Physical network segment",
        "Logical network segment",
        "Wireless network",
        "VPN connection"
      ],
      correct: 1,
      explanation: "A VLAN (Virtual Local Area Network) is a logical network segment that groups devices together regardless of their physical location.",
      wrongExplanations: [
        "VLANs are logical, not physical segments.",
        null,
        "Wireless networks can use VLANs but aren't VLANs themselves.",
        "VPNs are for remote access, not network segmentation."
      ],
      topic: "2.3 — VLANs"
    },
    {
      id: 45,
      question: "Which command would you use to view the routing table on a Cisco router?",
      choices: [
        "show ip route",
        "show route",
        "display route",
        "get route"
      ],
      correct: 0,
      explanation: "The 'show ip route' command displays the routing table on Cisco routers, showing all known routes.",
      wrongExplanations: [
        null,
        "This is not a valid Cisco command.",
        "This is not a valid Cisco command.",
        "This is not a valid Cisco command."
      ],
      topic: "2.2 — Routing commands"
    },
    {
      id: 46,
      question: "What is the administrative distance of a directly connected route?",
      choices: ["0", "1", "90", "110"],
      correct: 0,
      explanation: "Directly connected routes have an administrative distance of 0, making them the most trusted routes.",
      wrongExplanations: [
        null,
        "1 is the administrative distance for static routes.",
        "90 is the administrative distance for EIGRP.",
        "110 is the administrative distance for OSPF."
      ],
      topic: "2.2 — Administrative distance"
    },
    {
      id: 47,
      question: "What does NAT stand for?",
      choices: [
        "Network Address Translation",
        "Network Access Technology",
        "Node Address Transfer",
        "Network Application Tool"
      ],
      correct: 0,
      explanation: "NAT (Network Address Translation) translates private IP addresses to public IP addresses for internet communication.",
      wrongExplanations: [
        null,
        "This is not the correct expansion of NAT.",
        "This is not the correct expansion of NAT.",
        "This is not the correct expansion of NAT."
      ],
      topic: "2.1 — NAT"
    },
    {
      id: 48,
      question: "Which protocol does OSPF use to communicate with other routers?",
      choices: ["TCP", "UDP", "IP protocol 89", "ICMP"],
      correct: 2,
      explanation: "OSPF uses IP protocol number 89 to communicate directly with other OSPF routers.",
      wrongExplanations: [
        "OSPF doesn't use TCP.",
        "OSPF doesn't use UDP.",
        null,
        "ICMP is used for diagnostics like ping, not routing protocols."
      ],
      topic: "2.2 — OSPF protocol"
    },
    {
      id: 49,
      question: "What is the purpose of a default route?",
      choices: [
        "Route to a specific network",
        "Route for all unknown destinations",
        "Route for local traffic only",
        "Block all traffic"
      ],
      correct: 1,
      explanation: "A default route (0.0.0.0/0) is used for all destinations that don't have a more specific route in the routing table.",
      wrongExplanations: [
        "Specific network routes are more specific than default routes.",
        null,
        "Default routes typically point to external networks, not local traffic.",
        "Default routes forward traffic, not block it."
      ],
      topic: "2.2 — Default routing"
    },
    {
      id: 50,
      question: "Which type of cable would you use to connect a router to a switch?",
      choices: [
        "Crossover cable",
        "Straight-through cable",
        "Rollover cable",
        "Coaxial cable"
      ],
      correct: 1,
      explanation: "A straight-through cable is used to connect different device types, such as a router to a switch.",
      wrongExplanations: [
        "Crossover cables connect similar devices (switch to switch, router to router).",
        null,
        "Rollover cables are used for console connections.",
        "Coaxial cables are not used for modern Ethernet connections."
      ],
      topic: "2.1 — Cable types"
    },
    {
      id: 51,
      question: "What is the maximum hop count for RIP?",
      choices: ["10", "15", "16", "255"],
      correct: 1,
      explanation: "RIP has a maximum hop count of 15. A route with 16 hops is considered unreachable.",
      wrongExplanations: [
        "10 is within RIP's valid range.",
        null,
        "16 hops is considered unreachable in RIP.",
        "255 is not related to RIP's hop count limitation."
      ],
      topic: "2.2 — RIP limitations"
    },
    {
      id: 52,
      question: "Which protocol provides IP address configuration automatically?",
      choices: ["DNS", "DHCP", "ARP", "NAT"],
      correct: 1,
      explanation: "DHCP (Dynamic Host Configuration Protocol) automatically provides IP addresses and network configuration to devices.",
      wrongExplanations: [
        "DNS resolves domain names to IP addresses.",
        null,
        "ARP resolves IP addresses to MAC addresses.",
        "NAT translates private to public IP addresses."
      ],
      topic: "2.4 — DHCP"
    },
    {
      id: 53,
      question: "What is the purpose of a trunk port?",
      choices: [
        "Connect end devices",
        "Carry traffic for multiple VLANs",
        "Block all traffic",
        "Provide power to devices"
      ],
      correct: 1,
      explanation: "Trunk ports carry traffic for multiple VLANs between switches using VLAN tagging (802.1Q).",
      wrongExplanations: [
        "Access ports connect end devices to specific VLANs.",
        null,
        "Trunk ports forward tagged traffic, not block it.",
        "PoE (Power over Ethernet) provides power, independent of trunk functionality."
      ],
      topic: "2.3 — Trunk ports"
    },
    {
      id: 54,
      question: "Which routing metric does OSPF use?",
      choices: ["Hop count", "Bandwidth", "Cost", "Delay"],
      correct: 2,
      explanation: "OSPF uses cost as its metric, which is calculated based on interface bandwidth. Lower cost is preferred.",
      wrongExplanations: [
        "RIP uses hop count, not OSPF.",
        "Bandwidth influences OSPF cost calculation but isn't the metric itself.",
        null,
        "EIGRP uses delay as part of its composite metric."
      ],
      topic: "2.2 — OSPF metric"
    },
    {
      id: 55,
      question: "What is the difference between a hub and a switch?",
      choices: [
        "No difference",
        "Switch makes intelligent forwarding decisions, hub broadcasts to all ports",
        "Hub is faster",
        "Switch only works with fiber"
      ],
      correct: 1,
      explanation: "Switches use MAC address tables to forward frames only to the destination port, while hubs broadcast to all ports.",
      wrongExplanations: [
        "There are significant differences in operation.",
        null,
        "Switches are typically faster due to intelligent forwarding.",
        "Switches work with both copper and fiber."
      ],
      topic: "2.1 — Hubs vs Switches"
    },
    {
      id: 56,
      question: "What does BGP stand for?",
      choices: [
        "Border Gateway Protocol",
        "Basic Gateway Protocol",
        "Broadcast Gateway Protocol",
        "Backbone Gateway Protocol"
      ],
      correct: 0,
      explanation: "BGP (Border Gateway Protocol) is the routing protocol used between autonomous systems on the internet.",
      wrongExplanations: [
        null,
        "This is not the correct expansion of BGP.",
        "This is not the correct expansion of BGP.",
        "This is not the correct expansion of BGP."
      ],
      topic: "2.2 — BGP"
    },
    {
      id: 57,
      question: "In DHCP, what is the correct order of messages?",
      choices: [
        "Discover, Request, Offer, Ack",
        "Discover, Offer, Request, Ack",
        "Offer, Discover, Ack, Request",
        "Request, Discover, Offer, Ack"
      ],
      correct: 1,
      explanation: "The DHCP process follows DORA: Discover, Offer, Request, Acknowledge.",
      wrongExplanations: [
        "The order is incorrect; Offer comes before Request.",
        null,
        "The order is completely wrong.",
        "The order starts with Discover, not Request."
      ],
      topic: "2.4 — DHCP process"
    },
    {
      id: 58,
      question: "What is the purpose of VLAN tagging (802.1Q)?",
      choices: [
        "Encrypt traffic",
        "Identify which VLAN a frame belongs to",
        "Compress data",
        "Authenticate users"
      ],
      correct: 1,
      explanation: "802.1Q VLAN tagging adds a tag to Ethernet frames to identify which VLAN the frame belongs to when traversing trunk links.",
      wrongExplanations: [
        "Encryption is handled by protocols like IPsec or TLS, not VLAN tagging.",
        null,
        "Data compression is not a function of VLAN tagging.",
        "User authentication is handled by protocols like 802.1X, not VLAN tagging."
      ],
      topic: "2.3 — VLAN tagging"
    },
    {
      id: 59,
      question: "Which routing protocol metric is based solely on hop count?",
      choices: ["OSPF", "EIGRP", "RIP", "IS-IS"],
      correct: 2,
      explanation: "RIP (Routing Information Protocol) uses hop count as its only metric, with a maximum of 15 hops.",
      wrongExplanations: [
        "OSPF uses cost based on bandwidth.",
        "EIGRP uses a composite metric including bandwidth, delay, load, and reliability.",
        null,
        "IS-IS uses cost similar to OSPF."
      ],
      topic: "2.2 — Routing metrics"
    },
    {
      id: 60,
      question: "What does NAT overload (PAT) allow?",
      choices: [
        "Multiple private IPs to share one public IP",
        "Faster routing",
        "VLAN separation",
        "Load balancing"
      ],
      correct: 0,
      explanation: "NAT overload (Port Address Translation) allows multiple internal devices to share a single public IP address by using different port numbers.",
      wrongExplanations: [
        null,
        "NAT doesn't improve routing speed; it translates addresses.",
        "VLAN separation is a Layer 2 function, not related to NAT.",
        "While NAT can be part of load balancing solutions, that's not its primary purpose."
      ],
      topic: "2.1 — NAT/PAT"
    },
    {
      id: 61,
      question: "Which port number does DNS use?",
      choices: ["25", "53", "80", "443"],
      correct: 1,
      explanation: "DNS uses port 53 for both UDP and TCP connections.",
      wrongExplanations: [
        "Port 25 is used by SMTP for email.",
        null,
        "Port 80 is used by HTTP.",
        "Port 443 is used by HTTPS."
      ],
      topic: "2.1 — Common ports"
    },
    {
      id: 62,
      question: "What is the purpose of a distribution layer in a three-tier network design?",
      choices: [
        "Connect end users",
        "Aggregate access layer and route between VLANs",
        "Connect to ISP",
        "Provide wireless access"
      ],
      correct: 1,
      explanation: "The distribution layer aggregates multiple access layer switches and provides inter-VLAN routing and policy enforcement.",
      wrongExplanations: [
        "Connecting end users is the function of the access layer.",
        null,
        "ISP connections are typically at the core or edge layer.",
        "Wireless access is provided at the access layer."
      ],
      topic: "2.1 — Network architecture"
    },
    {
      id: 63,
      question: "Which protocol automatically assigns IP addresses to devices?",
      choices: ["DNS", "ARP", "DHCP", "ICMP"],
      correct: 2,
      explanation: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and other network configuration to devices.",
      wrongExplanations: [
        "DNS resolves domain names to IP addresses.",
        "ARP resolves IP addresses to MAC addresses.",
        null,
        "ICMP is used for error reporting and diagnostics (like ping)."
      ],
      topic: "2.4 — DHCP"
    },
    {
      id: 64,
      question: "What does inter-VLAN routing require?",
      choices: [
        "Layer 2 switch only",
        "Hub",
        "Layer 3 device (router or Layer 3 switch)",
        "Repeater"
      ],
      correct: 2,
      explanation: "Inter-VLAN routing requires a Layer 3 device because VLANs are separate broadcast domains that need routing to communicate.",
      wrongExplanations: [
        "Layer 2 switches can create VLANs but cannot route between them.",
        "Hubs operate at Layer 1 and cannot perform any routing.",
        null,
        "Repeaters only amplify signals at Layer 1."
      ],
      topic: "2.3 — Inter-VLAN routing"
    },
    {
      id: 65,
      question: "Which STP port state forwards traffic and learns MAC addresses?",
      choices: ["Blocking", "Listening", "Learning", "Forwarding"],
      correct: 3,
      explanation: "The Forwarding state is the only STP state where a port forwards traffic and learns MAC addresses.",
      wrongExplanations: [
        "Blocking state discards frames except BPDUs.",
        "Listening state doesn't forward frames or learn MAC addresses.",
        "Learning state learns MAC addresses but doesn't forward frames.",
        null
      ],
      topic: "2.3 — STP port states"
    },
    {
      id: 66,
      question: "What is the maximum hop count for RIP before a route is considered unreachable?",
      choices: ["10", "15", "16", "255"],
      correct: 2,
      explanation: "RIP considers a route unreachable at 16 hops, making 15 the maximum usable hop count.",
      wrongExplanations: [
        "10 hops is within RIP's valid range.",
        "15 is the maximum usable hop count, but 16 means unreachable.",
        null,
        "255 is not related to RIP's hop count limitation."
      ],
      topic: "2.2 — RIP limitations"
    },
    {
      id: 67,
      question: "Which device uses a MAC address table to forward frames?",
      choices: ["Router", "Switch", "Hub", "Modem"],
      correct: 1,
      explanation: "Switches use MAC address tables (also called CAM tables) to forward frames to the correct port based on destination MAC address.",
      wrongExplanations: [
        "Routers use routing tables with IP addresses, not MAC address tables.",
        null,
        "Hubs don't have tables; they broadcast to all ports.",
        "Modems convert signals between different media types."
      ],
      topic: "2.1 — Switches"
    },
    {
      id: 68,
      question: "What is a static route?",
      choices: [
        "Automatically learned route",
        "Manually configured route",
  ],
  3: [
    {
      id: 91,
      question: "What command displays interface status on a Cisco device?",
      choices: ["show interface", "show ip interface", "show ip interface brief", "display interface"],
      correct: 2,
      explanation: "The 'show ip interface brief' command provides a quick summary of all interfaces, their IP addresses, and status.",
      wrongExplanations: ["'show interface' shows detailed info for one interface.", "'show ip interface' shows IP-specific interface details.", null, "This is not a valid Cisco command."],
      topic: "3.1 — Interface commands"
    },
    {
      id: 92,
      question: "Which tool tests connectivity at Layer 3?",
      choices: ["Cable tester", "Ping", "Multimeter", "Crimper"],
      correct: 1,
      explanation: "Ping uses ICMP to test Layer 3 (Network layer) connectivity by sending echo requests and receiving echo replies.",
      wrongExplanations: ["Cable testers work at Layer 1 (Physical).", null, "Multimeters test electrical properties.", "Crimpers are for attaching connectors."],
      topic: "3.2 — Network tools"
    },
    {
      id: 93,
      question: "What does traceroute display?",
      choices: ["MAC addresses", "Path packets take to destination", "DNS records", "DHCP leases"],
      correct: 1,
      explanation: "Traceroute shows the path (hops) that packets take from source to destination, helping identify routing issues.",
      wrongExplanations: ["ARP shows MAC addresses.", null, "nslookup displays DNS records.", "DHCP servers show lease information."],
      topic: "3.2 — Traceroute"
    },
    {
      id: 94,
      question: "Which protocol does ping use?",
      choices: ["TCP", "UDP", "ICMP", "IGMP"],
      correct: 2,
      explanation: "Ping uses ICMP (Internet Control Message Protocol) to send echo requests and receive echo replies.",
      wrongExplanations: ["TCP is a transport protocol for reliable connections.", "UDP is a transport protocol for connectionless communication.", null, "IGMP is used for multicast group management."],
      topic: "3.2 — ICMP"
    },
    {
      id: 95,
      question: "What is the purpose of a network baseline?",
      choices: ["Increase speed", "Document normal network performance", "Block traffic", "Assign IPs"],
      correct: 1,
      explanation: "A network baseline documents normal network performance metrics, allowing you to identify anomalies and troubleshoot issues.",
      wrongExplanations: ["Baselines document performance; they don't increase speed.", null, "Firewalls block traffic.", "DHCP assigns IP addresses."],
      topic: "3.3 — Network baseline"
    },
    {
      id: 96,
      question: "Which command shows the routing table on Windows?",
      choices: ["route print", "show route", "display route", "ipconfig /route"],
      correct: 0,
      explanation: "The 'route print' command displays the routing table on Windows systems.",
      wrongExplanations: [null, "This is a Cisco command, not Windows.", "This is not a valid Windows command.", "This is not a valid Windows command."],
      topic: "3.1 — Windows commands"
    },
    {
      id: 97,
      question: "What does nslookup do?",
      choices: ["Test connectivity", "Query DNS servers", "Check routes", "Monitor bandwidth"],
      correct: 1,
      explanation: "Nslookup queries DNS servers to resolve hostnames to IP addresses or perform reverse lookups.",
      wrongExplanations: ["Ping tests connectivity.", null, "Traceroute checks routes.", "Monitoring tools check bandwidth."],
      topic: "3.2 — DNS tools"
    },
    {
      id: 98,
      question: "Which tool captures and analyzes network packets?",
      choices: ["Ping", "Traceroute", "Wireshark", "Ipconfig"],
      correct: 2,
      explanation: "Wireshark is a protocol analyzer that captures and displays network packets for detailed analysis.",
      wrongExplanations: ["Ping tests connectivity.", "Traceroute shows packet paths.", null, "Ipconfig displays IP configuration."],
      topic: "3.2 — Packet analyzers"
    },
    {
      id: 99,
      question: "What command releases a DHCP-assigned IP address on Windows?",
      choices: ["ipconfig /release", "dhcp release", "ip release", "release ip"],
      correct: 0,
      explanation: "The 'ipconfig /release' command releases the current DHCP-assigned IP address on Windows.",
      wrongExplanations: [null, "This is not a valid command.", "This is not a valid command.", "This is not a valid command."],
      topic: "3.1 — Windows networking"
    },
    {
      id: 100,
      question: "Which command shows network connections and listening ports?",
      choices: ["ping", "netstat", "tracert", "nslookup"],
      correct: 1,
      explanation: "Netstat displays active network connections, listening ports, and protocol statistics.",
      wrongExplanations: ["Ping tests connectivity.", null, "Tracert shows packet routes.", "Nslookup queries DNS."],
      topic: "3.1 — Connection monitoring"
    },
    {
      id: 101,
      question: "What does ARP cache contain?",
      choices: ["DNS records", "IP to MAC address mappings", "Routing table", "DHCP leases"],
      correct: 1,
      explanation: "The ARP cache stores recently resolved IP to MAC address mappings for faster communication on the local network.",
      wrongExplanations: ["DNS cache stores domain name resolutions.", null, "Routing tables store network routes.", "DHCP servers maintain lease databases."],
      topic: "3.1 — ARP cache"
    },
    {
      id: 102,
      question: "Which command displays IP configuration on Windows?",
      choices: ["ifconfig", "ipconfig", "ip addr", "netstat"],
      correct: 1,
      explanation: "The 'ipconfig' command displays TCP/IP network configuration on Windows systems.",
      wrongExplanations: ["ifconfig is used on Linux/Unix systems.", null, "'ip addr' is a Linux command.", "netstat shows network connections, not IP configuration."],
      topic: "3.1 — Windows commands"
    },
    {
      id: 103,
      question: "What is the purpose of a loopback test?",
      choices: ["Test external connectivity", "Test local TCP/IP stack", "Test DNS", "Test DHCP"],
      correct: 1,
      explanation: "A loo
  ],
  {
      id: 104,
      question: "Which protocol number does ICMP use?",
      choices: ["1", "6", "17", "89"],
      correct: 0,
      explanation: "ICMP uses IP protocol number 1.",
      wrongExplanations: [null, "6 is TCP.", "17 is UDP.", "89 is OSPF."],
      topic: "3.2 — Protocol numbers"
    },
    {
      id: 105,
      question: "What command renews a DHCP lease on Windows?",
      choices: ["ipconfig /renew", "dhcp renew", "ip renew", "renew ip"],
      correct: 0,
      explanation: "The 'ipconfig /renew' command requests a new IP address from the DHCP server.",
      wrongExplanations: [null, "Not a valid command.", "Not a valid command.", "Not a valid command."],
      topic: "3.1 — DHCP commands"
    },
    {
      id: 106,
      question: "Which tool measures cable length and detects faults?",
      choices: ["Multimeter", "TDR", "Toner probe", "Cable certifier"],
      correct: 1,
      explanation: "A TDR (Time Domain Reflectometer) measures cable length and locates faults.",
      wrongExplanations: ["Multimeters measure electrical properties.", null, "Toner probes trace cables.", "Certifiers verify standards."],
      topic: "3.3 — Cable testing"
    },
    {
      id: 107,
      question: "What does 'arp -a' display?",
      choices: ["Routing table", "ARP cache", "DNS cache", "Connections"],
      correct: 1,
      explanation: "The 'arp -a' command displays the ARP cache with IP-to-MAC mappings.",
      wrongExplanations: ["'route print' shows routing table.", null, "'ipconfig /displaydns' shows DNS cache.", "'netstat' shows connections."],
      topic: "3.1 — ARP commands"
    },
    {
      id: 108,
      question: "Which command flushes DNS cache on Windows?",
      choices: ["ipconfig /flushdns", "dns flush", "clear dns", "dnscache clear"],
      correct: 0,
      explanation: "The 'ipconfig /flushdns' command clears the DNS resolver cache.",
      wrongExplanations: [null, "Not valid.", "Not valid.", "Not valid."],
      topic: "3.1 — DNS commands"
    },
    {
      id: 109,
      question: "What is port mirroring (SPAN) used for?",
      choices: ["Increase bandwidth", "Copy traffic to monitoring port", "Block traffic", "Assign VLANs"],
      correct: 1,
      explanation: "Port mirroring copies traffic to a monitoring port for analysis.",
      wrongExplanations: ["Doesn't increase bandwidth.", null, "ACLs block traffic.", "VLANs are assigned directly."],
      topic: "3.3 — Monitoring"
    },
    {
      id: 110,
      question: "Which command displays hostname on Windows?",
      choices: ["hostname", "computername", "name", "ipconfig /host"],
      correct: 0,
      explanation: "The 'hostname' command displays the computer's hostname.",
      wrongExplanations: [null, "Not valid.", "Not valid.", "Not valid."],
      topic: "3.1 — System commands"
    },
    {
      id: 111,
      question: "What does MTR combine?",
      choices: ["Ping and DNS", "Ping and traceroute", "DNS and DHCP", "ARP and ICMP"],
      correct: 1,
      explanation: "MTR combines ping and traceroute functionality continuously.",
      wrongExplanations: ["MTR uses ping and traceroute.", null, "MTR doesn't combine DNS and DHCP.", "MTR uses ICMP like ping."],
      topic: "3.2 — Diagnostics"
    },
    {
      id: 112,
      question: "Which tool locates cables in walls?",
      choices: ["Cable tester", "Toner probe", "Multimeter", "Crimper"],
      correct: 1,
      explanation: "A toner probe (fox and hound) traces cables by generating and detecting tones.",
      wrongExplanations: ["Cable testers verify connectivity.", null, "Multimeters measure voltage.", "Crimpers attach connectors."],
      topic: "3.3 — Cable tracing"
    },
    {
      id: 113,
      question: "What is SNMP used for?",
      choices: ["Email", "Network monitoring", "File transfer", "Web browsing"],
      correct: 1,
      explanation: "SNMP (Simple Network Management Protocol) monitors and manages network devices.",
      wrongExplanations: ["SMTP handles email.", null, "FTP handles file transfer.", "HTTP handles web browsing."],
      topic: "3.3 — Management"
    },
    {
      id: 114,
      question: "Which command shows TCP connections?",
      choices: ["netstat -a", "ping -a", "tracert -a", "ipconfig -a"],
      correct: 0,
      explanation: "The 'netstat -a' command displays all active TCP connections.",
      wrongExplanations: [null, "Ping doesn't have -a for connections.", "Tracert doesn't show connections.", "Not a valid option."],
      topic: "3.1 — Connection monitoring"
    },
    {
      id: 115,
      question: "What does a cable certifier verify?",
      choices: ["Only connectivity", "Cable standards compliance", "Only length", "Only colors"],
      correct: 1,
      explanation: "Cable certifiers verify complete compliance with industry standards.",
      wrongExplanations: ["Tests more than connectivity.", null, "Tests multiple parameters.", "Colors are visual."],
      topic: "3.3 — Certification"
    },
    {
      id: 116,
      question: "Which Linux command shows IP configuration?",
      choices: ["ipconfig", "ifconfig", "netconfig", "showip"],
      correct: 1,
      explanation: "The 'ifconfig' command displays network configuration on Linux/Unix.",
      wrongExplanations: ["ipconfig is Windows.", null, "Not standard.", "Not standard."],
      topic: "3.1 — Linux commands"
    },
    {
      id: 117,
      question: "What is the default Windows ping TTL?",
      choices: ["32", "64", "128", "255"],
      correct: 2,
      explanation: "Windows ping uses a default TTL of 128.",
      wrongExplanations: ["Not default.", "64 is Linux default.", null, "255 is maximum."],
      topic: "3.2 — Ping parameters"
    },
    {
      id: 118,
      question: "Which tool tests UDP ports?",
      choices: ["ping", "telnet", "netcat", "traceroute"],
      correct: 2,
      explanation: "Netcat (nc) can test both TCP and UDP connectivity.",
      wrongExplanations: ["Ping uses ICMP.", "Telnet tests TCP only.", null, "Traceroute shows paths."],
      topic: "3.2 — Advanced tools"
    },
    {
      id: 119,
      question: "What does pathping do?",
      choices: ["Only pings", "Combines ping and traceroute", "Only traces", "Tests bandwidth"],
      correct: 1,
      explanation: "Pathping combines ping and traceroute with statistics.",
      wrongExplanations: ["Does more than ping.", null, "Does more than trace.", "iperf tests bandwidth."],
      topic: "3.2 — Windows tools"
    },
    {
      id: 120,
      question: "Which SNMP version encrypts?",
      choices: ["SNMPv1", "SNMPv2", "SNMPv2c", "SNMPv3"],
      correct: 3,
      explanation: "SNMPv3 provides authentication and encryption.",
      wrongExplanations: ["v1 uses community strings.", "v2 doesn't encrypt.", "v2c uses community strings.", null],
      topic: "3.3 — SNMP security"
    },
    {
      id: 121,
      question: "What is a syslog server for?",
      choices: ["Assign IPs", "Centralized logging", "Route traffic", "Resolve DNS"],
      correct: 1,
      explanation: "Syslog servers collect and store logs from network devices centrally.",
      wrongExplanations: ["DHCP assigns IPs.", null, "Routers route traffic.", "DNS resolves names."],
      topic: "3.3 — Log management"
    },
    {
      id: 122,
      question: "Which Linux command traces routes?",
      choices: ["tracert", "traceroute", "pathping", "route trace"],
      correct: 1,
      explanation: "The 'traceroute' command on Linux shows packet paths.",
      wrongExplanations: ["tracert is Windows.", null, "pathping is Windows.", "Not valid."],
      topic: "3.2 — Linux diagnostics"
    },
    {
      id: 123,
      question: "What does a punch down tool do?",
      choices: ["Test cables", "Terminate cables on panels", "Trace cables", "Measure voltage"],
      correct: 1,
      explanation: "Punch down tools terminate twisted pair cables on patch panels or jacks.",
      wrongExplanations: ["Cable testers test.", null, "Toner probes trace.", "Multimeters measure voltage."],
      topic: "3.3 — Installation tools"
    },
    {
      id: 124,
      question: "Which protocol does Linux traceroute use?",
      choices: ["TCP", "UDP", "ICMP", "IGMP"],
      correct: 1,
      explanation: "Linux traceroute typically uses UDP packets.",
      wrongExplanations: ["Some use TCP.", null, "Windows uses ICMP.", "IGMP is for multicast."],
      topic: "3.2 — Protocol usage"
    },
    {
      id: 125,
      question: "What is network documentation for?",
      choices: ["Slow network", "Record design and changes", "Increase costs", "Block users"],
      correct: 1,
      explanation: "Documentation records network design, configurations, and changes.",
      wrongExplanations: ["Doesn't slow network.", null, "Saves money long-term.", "Doesn't block users."],
      topic: "3.3 — Documentation"
    },
    {
      id: 126,
      question: "Which command shows ARP cache?",
      choices: ["mac -a", "arp -a", "show mac", "display arp"],
      correct: 1,
      explanation: "The 'arp -a' command displays the ARP cache.",
      wrongExplanations: ["Not valid.", null, "Cisco command.", "Not valid."],
      topic: "3.1 — ARP viewing"
    },
    {
      id: 127,
      question: "What does iPerf measure?",
      choices: ["DNS time", "Network bandwidth", "Packet loss", "Routes"],
      correct: 1,
      explanation: "iPerf measures maximum network bandwidth between two points.",
      wrongExplanations: ["Tests bandwidth.", null, "Bandwidth is primary.", "Traceroute shows routes."],
      topic: "3.3 — Performance testing"
    },
    {
      id: 128,
      question: "Which command shows DNS cache on Windows?",
      choices: ["ipconfig /displaydns", "dns cache", "show dns", "arp -dns"],
      correct: 0,
      explanation: "The 'ipconfig /displaydns' command displays DNS cache.",
      wrongExplanations: [null, "Not valid.", "Not valid.", "Not valid."],
      topic: "3.1 — DNS cache"
    },
    {
      id: 129,
      question: "What is environmental monitoring?",
      choices: ["Outdoor weather", "Server room conditions", "User behavior", "Bandwidth"],
      correct: 1,
      explanation: "Environmental monitoring tracks temperature, humidity, and conditions in data centers.",
      wrongExplanations: ["Focuses on equipment environment.", null, "Different monitoring.", "Performance monitoring."],
      topic: "3.3 — Environmental"
    },
    {
      id: 130,
      question: "Which tool verifies cable wiring standards?",
      choices: ["Toner probe", "Cable certifier", "Crimper", "Multimeter"],
      correct: 1,
      explanation: "Cable certifiers test cables against industry wiring standards.",
      wrongExplanations: ["Toner probes trace.", null, "Crimpers attach connectors.", "Multimeters test electrical properties."],
      topic: "3.3 — Cable verification"
    }
  4:[{
      id: 131,
      question: "Which type of attack involves flooding a network with traffic?",
      choices: ["Man-in-the-middle", "DDoS", "Social engineering", "SQL injection"],
      correct: 1,
      explanation: "DDoS (Distributed Denial of Service) attacks flood networks with excessive traffic to overwhelm resources.",
      wrongExplanations: ["Man-in-the-middle attacks intercept communications.", null, "Social engineering manipulates people.", "SQL injection targets databases."],
      topic: "4.2 — Network attacks"
    },
    {
      id: 132,
      question: "What is the purpose of a firewall?",
      choices: ["Encrypt data", "Filter network traffic", "Assign IP addresses", "Resolve domain names"],
      correct: 1,
      explanation: "Firewalls filter network traffic based on predetermined security rules to protect networks.",
      wrongExplanations: ["VPNs encrypt data.", null, "DHCP assigns IP addresses.", "DNS resolves domain names."],
      topic: "4.1 — Firewalls"
    },
    {
      id: 133,
      question: "Which wireless security standard is most secure?",
      choices: ["WEP", "WPA", "WPA2", "WPA3"],
      correct: 3,
      explanation: "WPA3 is the most secure wireless standard with enhanced encryption and protection against attacks.",
      wrongExplanations: ["WEP is outdated and easily cracked.", "WPA has known vulnerabilities.", "WPA2 is secure but vulnerable to KRACK attacks.", null],
      topic: "4.3 — Wireless security"
    },
    {
      id: 134,
      question: "What does 802.1X provide?",
      choices: ["Wireless speeds", "Port-based network access control", "IP addressing", "DNS resolution"],
      correct: 1,
      explanation: "802.1X provides port-based network access control, requiring authentication before granting access.",
      wrongExplanations: ["802.11 standards define wireless speeds.", null, "DHCP provides IP addressing.", "DNS provides name resolution."],
      topic: "4.4 — Network access control"
    },
    {
      id: 135,
      question: "Which VPN protocol operates at Layer 2?",
      choices: ["IPsec", "SSL/TLS", "L2TP", "SSH"],
      correct: 2,
      explanation: "L2TP (Layer 2 Tunneling Protocol) operates at Layer 2, often combined with IPsec for encryption.",
      wrongExplanations: ["IPsec operates at Layer 3.", "SSL/TLS operates at Layers 5-6.", null, "SSH operates at Layer 7."],
      topic: "4.2 — VPN protocols"
    },
    {
      id: 136,
      question: "What is the purpose of an ACL?",
      choices: ["Assign IP addresses", "Filter traffic based on rules", "Resolve DNS", "Synchronize time"],
      correct: 1,
      explanation: "ACLs filter network traffic by permitting or denying packets based on defined rules.",
      wrongExplanations: ["DHCP assigns IP addresses.", null, "DNS resolves names.", "NTP synchronizes time."],
      topic: "4.1 — Access control lists"
    },
    {
      id: 137,
      question: "Which attack floods a network with SYN packets?",
      choices: ["DDoS", "SYN flood", "Man-in-the-middle", "DNS poisoning"],
      correct: 1,
      explanation: "A SYN flood exploits the TCP handshake by sending numerous SYN packets without completing connections.",
      wrongExplanations: ["DDoS is broader; SYN flood is a specific type.", null, "Man-in-the-middle intercepts communications.", "DNS poisoning corrupts DNS cache."],
      topic: "4.2 — Network attacks"
    },
    {
      id: 138,
      question: "What does a RADIUS server provide?",
      choices: ["IP addressing", "AAA services", "DNS resolution", "File sharing"],
      correct: 1,
      explanation: "RADIUS servers provide centralized AAA (Authentication, Authorization, Accounting) services.",
      wrongExplanations: ["DHCP provides IP addressing.", null, "DNS provides name resolution.", "File servers provide file sharing."],
      topic: "4.4 — AAA services"
    },
    {
      id: 139,
      question: "Which type of firewall inspects connection state?",
      choices: ["Packet filtering", "Stateful", "Application layer", "Circuit level"],
      correct: 1,
      explanation: "Stateful firewalls track connection state and make decisions based on context.",
      wrongExplanations: ["Packet filtering examines individual packets.", null, "Application layer firewalls inspect application data.", "Circuit level firewalls work at session layer."],
      topic: "4.1 — Firewall types"
    },
    {
      id: 140,
      question: "What does IPsec provide?",
      choices: ["Web browsing", "Secure IP communications", "Email delivery", "File transfer"],
      correct: 1,
      explanation: "IPsec provides secure IP communications through encryption and authentication.",
      wrongExplanations: ["HTTP/HTTPS handle web browsing.", null, "SMTP handles email.", "FTP handles file transfer."],
      topic: "4.2 — VPN encryption"
    },
    {
      id: 141,
      question: "Which authentication factor is a smart card?",
      choices: ["Something you know", "Something you have", "Something you are", "Somewhere you are"],
      correct: 1,
      explanation: "Smart cards are 'something you have' - a physical token required for authentication.",
      wrongExplanations: ["Passwords are 'something you know'.", null, "Biometrics are 'something you are'.", "Geolocation is 'somewhere you are'."],
      topic: "4.4 — Authentication factors"
    },
    {
      id: 142,
      question: "What does an IPS do differently than an IDS?",
      choices: ["Only monitors", "Actively blocks threats", "Assigns IPs", "Routes traffic"],
      correct: 1,
      explanation: "IPS actively blocks threats, while IDS only detects and alerts.",
      wrongExplanations: ["Monitoring only is IDS function.", null, "DHCP assigns IPs.", "Routers route traffic."],
      topic: "4.1 — IDS vs IPS"
    },
    {
      id: 143,
      question: "Which port does HTTPS use?",
      choices: ["21", "80", "443", "8080"],
      correct: 2,
      explanation: "HTTPS uses port 443 for encrypted web communications.",
      wrongExplanations: ["Port 21 is FTP.", "Port 80 is HTTP.", null, "Port 8080 is alternate HTTP."],
      topic: "4.1 — Secure protocols"
    },
    {
      id: 144,
      question: "What is a rogue access point?",
      choices: ["Authorized AP", "Unauthorized AP on network", "Broken AP", "Wireless controller"],
      correct: 1,
      explanation: "A rogue AP is unauthorized and creates security risks by bypassing controls.",
      wrongExplanations: ["Authorized APs are legitimate.", null, "Broken APs are malfunctioning.", "Controllers manage authorized APs."],
      topic: "4.3 — Wireless threats"
    },
    {
      id: 145,
      question: "Which attack tricks users into revealing credentials?",
      choices: ["DDoS", "Phishing", "SYN flood", "ARP poisoning"],
      correct: 1,
      explanation: "Phishing uses fake websites or emails to trick users into revealing sensitive information.",
      wrongExplanations: ["DDoS overwhelms systems.", null, "SYN floods exhaust connections.", "ARP poisoning redirects traffic."],
      topic: "4.5 — Social engineering"
    },
    {
      id: 146,
      question: "What does geofencing control?",
      choices: ["Network speed", "Access based on location", "Bandwidth", "DNS queries"],
      correct: 1,
      explanation: "Geofencing controls access based on geographic location.",
      wrongExplanations: ["QoS controls speed.", null, "QoS manages bandwidth.", "DNS servers handle queries."],
      topic: "4.4 — Access control"
    },
    {
      id: 147,
      question: "Which protocol provides secure remote access?",
      choices: ["Telnet", "SSH", "FTP", "HTTP"],
      correct: 1,
      explanation: "SSH provides encrypted remote access, replacing insecure Telnet.",
      wrongExplanations: ["Telnet is unencrypted.", null, "FTP is for file transfer.", "HTTP is for web traffic."],
      topic: "4.1 — Remote access"
    },
    {
      id: 148,
      question: "What does MAC filtering do?",
      choices: ["Filters by IP", "Allows/blocks by MAC address", "Encrypts data", "Assigns IPs"],
      correct: 1,
      explanation: "MAC filtering allows or blocks network access based on device MAC addresses.",
      wrongExplanations: ["IP filtering uses IP addresses.", null, "Encryption is separate.", "DHCP assigns IPs."],
      topic: "4.3 — Wireless security"
    },
    {
      id: 149,
      question: "What is port security on a switch?",
      choices: ["Encrypts ports", "Limits MAC addresses per port", "Blocks all traffic", "Assigns VLANs"],
      correct: 1,
      explanation: "Port security limits which MAC addresses can access a switch port.",
      wrongExplanations: ["Encryption is separate.", null, "Port security filters, not blocks all.", "VLAN assignment is separate."],
      topic: "4.1 — Switch security"
    },
    {
      id: 150,
      question: "Which attack intercepts communications between two parties?",
      choices: ["DDoS", "Phishing", "Man-in-the-middle", "SQL injection"],
      correct: 2,
      explanation: "Man-in-the-middle attacks intercept and potentially alter communications between parties.",
      wrongExplanations: ["DDoS overwhelms systems.", "Phishing tricks users.", null, "SQL injection targets databases."],
      topic: "4.2 — Network attacks"
    },
    {
      id: 151,
      question: "What does DHCP snooping prevent?",
      choices: ["DNS attacks", "Rogue DHCP servers", "Wireless attacks", "Routing loops"],
      correct: 1,
      explanation: "DHCP snooping prevents rogue DHCP servers from assigning addresses on the network.",
      wrongExplanations: ["DNSSEC prevents DNS attacks.", null, "Wireless security prevents wireless attacks.", "STP prevents loops."],
      topic: "4.1 — Layer 2 security"
    },
    {
      id: 152,
      question: "Which encryption does WPA3 use?",
      choices: ["WEP", "TKIP", "CCMP", "SAE"],
      correct: 3,
      explanation: "WPA3 uses SAE (Simultaneous Authentication of Equals) for enhanced security.",
      wrongExplanations: ["WEP is outdated.", "TKIP is from WPA.", "CCMP is from WPA2.", null],
      topic: "4.3 — Wireless encryption"
    },
    {
      id: 153,
      question: "What is a honeypot?",
      choices: ["Firewall", "Decoy system to attract attackers", "VPN", "IDS"],
      correct: 1,
      explanation: "A honeypot is a decoy system designed to attract and study attackers.",
      wrongExplanations: ["Firewalls filter traffic.", null, "VPNs provide remote access.", "IDS detects intrusions."],
      topic: "4.5 — Security tools"
    },
    {
      id: 154,
      question: "Which protocol encrypts email in transit?",
      choices: ["POP3", "IMAP", "SMTP", "TLS/SSL"],
      correct: 3,
      explanation: "TLS/SSL encrypts email protocols like SMTP, POP3, and IMAP in transit.",
      wrongExplanations: ["POP3 retrieves email.", "IMAP manages email.", "SMTP sends email.", null],
      topic: "4.1 — Email security"
    },
    {
      id: 155,
      question: "What is a zero-day vulnerability?",
      choices: ["Old vulnerability", "Unknown vulnerability", "Patched vulnerability", "Low-risk vulnerability"],
      correct: 1,
      explanation: "A zero-day vulnerability is unknown to vendors and has no available patch.",
      wrongExplanations: ["Zero-day means newly discovered.", null, "Zero-day means unpatched.", "Zero-day vulnerabilities are high-risk."],
      topic: "4.5 — Vulnerabilities"
    },
    {
      id: 156,
      question: "Which security practice involves testing defenses?",
      choices: ["Penetration testing", "Patching", "Monitoring", "Documentation"],
      correct: 0,
      explanation: "Penetration testing involves simulated attacks to test security defenses.",
      wrongExplanations: [null, "Patching fixes vulnerabilities.", "Monitoring watches for threats.", "Documentation records systems."],
      topic: "4.5 — Security testing"
    },
    {
      id: 157,
      question: "What does least privilege mean?",
      choices: ["Maximum access", "Minimum necessary access", "No access", "Random access"],
      correct: 1,
      explanation: "Least privilege grants users only the minimum access necessary for their role.",
      wrongExplanations: ["Least privilege limits access.", null, "Some access is needed.", "Access should be controlled, not random."],
      topic: "4.4 — Access control principles"
    },
    {
      id: 158,
      question: "Which attack modifies ARP tables?",
      choices: ["DNS poisoning", "ARP poisoning", "SYN flood", "Phishing"],
      correct: 1,
      explanation: "ARP poisoning corrupts ARP tables to redirect traffic to attackers.",
      wrongExplanations: ["DNS poisoning targets DNS.", null, "SYN floods exhaust connections.", "Phishing tricks users."],
      topic: "4.2 — Layer 2 attacks"
    },
    {
      id: 159,
      question: "What is defense in depth?",
      choices: ["Single firewall", "Multiple layers of security", "No security", "Software only"],
      correct: 1,
      explanation: "Defense in depth uses multiple layers of security controls to protect assets.",
      wrongExplanations: ["Single controls are insufficient.", null, "Security is essential.", "Hardware and software are both needed."],
      topic: "4.5 — Security strategy"
    },
    {
      id: 160,
      question: "Which protocol provides network device authentication?",
      choices: ["SNMP", "802.1X", "NTP", "DHCP"],
      correct: 1,
      explanation: "802.1X provides port-based network authentication for devices.",
      wrongExplanations: ["SNMP monitors devices.", null, "NTP synchronizes time.", "DHCP assigns addresses."],
      topic: "4.4 — Authentication"
    },
    {
      id: 161,
      question: "What is a VLAN hopping attack?",
      choices: ["Wireless attack", "Unauthorized VLAN access", "DNS attack", "Email attack"],
      correct: 1,
      explanation: "VLAN hopping allows attackers to gain unauthorized access to other VLANs.",
      wrongExplanations: ["VLAN hopping targets switched networks.", null, "DNS attacks target name resolution.", "Email attacks target messaging."],
      topic: "4.2 — VLAN security"
    },
    {
      id: 162,
      question: "Which security measure validates email senders?",
      choices: ["SPF", "DHCP", "NAT", "DNS"],
      correct: 0,
      explanation: "SPF (Sender Policy Framework) validates email senders to prevent spoofing.",
      wrongExplanations: [null, "DHCP assigns addresses.", "NAT translates addresses.", "DNS resolves names."],
      topic: "4.5 — Email security"
    },
    {
      id: 163,
      question: "What does a security policy define?",
      choices: ["Hardware specs", "Security rules and procedures", "Network speed", "Cable types"],
      correct: 1,
      explanation: "Security policies define rules, procedures, and expectations for security.",
      wrongExplanations: ["Hardware specs are technical documents.", null, "Performance specs define speed.", "Cable standards define types."],
      topic: "4.5 — Security governance"
    },
    {
      id: 164,
      question: "Which attack targets DNS servers?",
      choices: ["ARP poisoning", "DNS poisoning", "SYN flood", "Phishing"],
      correct: 1,
      explanation: "DNS poisoning corrupts DNS cache with false entries to redirect traffic.",
      wrongExplanations: ["ARP poisoning targets ARP tables.", null, "SYN floods target TCP connections.", "Phishing targets users."],
      topic: "4.2 — DNS attacks"
    },
    {
      id: 165,
      question: "What is multi-factor authentication?",
      choices: ["One factor", "Two or more authentication factors", "No authentication", "Password only"],
      correct: 1,
      explanation: "MFA requires two or more authentication factors for stronger security.",
      wrongExplanations: ["MFA requires multiple factors.", null, "Authentication is required.", "MFA needs more than passwords."],
      topic: "4.4 — Authentication"
    },
    {
      id: 166,
      question: "Which tool captures network traffic for analysis?",
      choices: ["Firewall", "Packet sniffer", "Router", "Switch"],
      correct: 1,
      explanation: "Packet sniffers capture and analyze network traffic for troubleshooting or security.",
      wrongExplanations: ["Firewalls filter traffic.", null, "Routers forward packets.", "Switches forward frames."],
      topic: "4.5 — Security tools"
    },
    {
      id: 167,
      question: "What is the purpose of network segmentation?",
      choices: ["Increase speed", "Isolate and control traffic", "Reduce costs", "Simplify management"],
      correct: 1,
      explanation: "Network segmentation isolates traffic to improve security and control access.",
      wrongExplanations: ["Segmentation improves security, not necessarily speed.", null, "Segmentation may increase costs.", "Segmentation adds complexity."],
      topic: "4.1 — Network design"
    },
    {
      id: 168,
      question: "Which encryption standard is used in WPA2?",
      choices: ["WEP", "TKIP", "AES", "DES"],
      correct: 2,
      explanation: "WPA2 uses AES (Advanced Encryption Standard) for strong encryption.",
      wrongExplanations: ["WEP is outdated.", "TKIP was used in WPA.", null, "DES is an older standard."],
      topic: "4.3 — Wireless encryption"
    },
    {
      id: 169,
      question: "What is a security baseline?",
      choices: ["Maximum security", "Minimum security standard", "No security", "Random security"],
      correct: 1,
      explanation: "A security baseline defines the minimum security standards for systems.",
      wrongExplanations: ["Baselines set minimums, not maximums.", null, "Baselines require security.", "Security should be planned, not random."],
      topic: "4.5 — Security standards"
    },
    {
      id: 170,
      question: "Which attack exploits weak passwords?",
      choices: ["DDoS", "Brute force", "Phishing", "DNS poisoning"],
      correct: 1,
      explanation: "Brute force attacks systematically try passwords to gain unauthorized access.",
      wrongExplanations: ["DDoS overwhelms systems.", null, "Phishing tricks users.", "DNS poisoning corrupts DNS."],
      topic: "4.2 — Password attacks"
    }

  ],
  5: [{
      id: 171,
      question: "What is the first step in troubleshooting methodology?",
      choices: ["Test the theory", "Identify the problem", "Implement solution", "Document findings"],
      correct: 1,
      explanation: "The first step in troubleshooting is to identify the problem by gathering information and symptoms.",
      wrongExplanations: ["Testing theory comes after establishing a theory.", null, "Implementation comes after identifying and planning.", "Documentation is the final step."],
      topic: "5.1 — Troubleshooting methodology"
    },
    {
      id: 172,
      question: "Which tool tests cable continuity?",
      choices: ["Protocol analyzer", "Cable tester", "Spectrum analyzer", "Bandwidth tester"],
      correct: 1,
      explanation: "Cable testers verify physical connectivity and continuity of network cables.",
      wrongExplanations: ["Protocol analyzers examine packet contents.", null, "Spectrum analyzers test wireless frequencies.", "Bandwidth testers measure throughput."],
      topic: "5.3 — Cable testing"
    },
    {
      id: 173,
      question: "What does a loopback plug test?",
      choices: ["Cable length", "Network interface functionality", "Bandwidth", "DNS resolution"],
      correct: 1,
      explanation: "A loopback plug tests network interface card functionality by creating a closed circuit.",
      wrongExplanations: ["TDR measures cable length.", null, "iPerf tests bandwidth.", "nslookup tests DNS."],
      topic: "5.3 — Hardware testing"
    },
    {
      id: 174,
      question: "Which layer should you troubleshoot first in the OSI model?",
      choices: ["Application", "Transport", "Network", "Physical"],
      correct: 3,
      explanation: "Following bottom-up troubleshooting, start with Physical layer (cables, connections, power).",
      wrongExplanations: ["Application is Layer 7, troubleshoot after lower layers.", "Transport is Layer 4, troubleshoot after lower layers.", "Network is Layer 3, troubleshoot after Physical and Data Link.", null],
      topic: "5.1 — Bottom-up troubleshooting"
    },
    {
      id: 175,
      question: "What does a flashing link light typically indicate?",
      choices: ["No connection", "Active data transmission", "Hardware failure", "Speed mismatch"],
      correct: 1,
      explanation: "Flashing link lights indicate active data transmission on the network interface.",
      wrongExplanations: ["No light indicates no connection.", null, "Hardware failure usually shows no light or steady amber.", "Speed mismatch may show steady light or different color."],
      topic: "5.2 — Physical indicators"
    },
    {
      id: 176,
      question: "Which command flushes the ARP cache?",
      choices: ["arp -a", "arp -d", "arp -s", "arp -flush"],
      correct: 1,
      explanation: "The 'arp -d' command deletes entries from the ARP cache.",
      wrongExplanations: ["'arp -a' displays the cache.", null, "'arp -s' adds a static entry.", "'-flush' is not a valid ARP parameter."],
      topic: "5.2 — ARP troubleshooting"
    },
    {
      id: 177,
      question: "What causes duplicate IP addresses?",
      choices: ["DNS failure", "Static IP conflicts or DHCP issues", "Routing loops", "Firewall rules"],
      correct: 1,
      explanation: "Duplicate IPs occur when two devices have the same address, from static assignment errors or DHCP problems.",
      wrongExplanations: ["DNS failure affects name resolution, not IP duplication.", null, "Routing loops cause network performance issues.", "Firewall rules control traffic, not IP assignment."],
      topic: "5.4 — IP conflicts"
    },
    {
      id: 178,
      question: "Which issue causes intermittent connectivity?",
      choices: ["Wrong subnet mask", "EMI or loose connections", "DNS misconfiguration", "Wrong gateway"],
      correct: 1,
      explanation: "Intermittent connectivity often results from electromagnetic interference or loose physical connections.",
      wrongExplanations: ["Wrong subnet mask causes persistent connectivity issues.", null, "DNS misconfiguration affects name resolution.", "Wrong gateway causes persistent routing issues."],
      topic: "5.4 — Intermittent issues"
    },
    {
      id: 179,
      question: "What does high latency indicate?",
      choices: ["Fast network", "Network congestion or distance", "Hardware failure", "Security breach"],
      correct: 1,
      explanation: "High latency indicates delays from network congestion, long distances, or slow devices.",
      wrongExplanations: ["High latency means slow response times.", null, "Complete hardware failure prevents connectivity.", "Security breaches may cause various symptoms."],
      topic: "5.4 — Performance issues"
    },
    {
      id: 180,
      question: "Which tool analyzes wireless spectrum?",
      choices: ["Cable tester", "Protocol analyzer", "Spectrum analyzer", "TDR"],
      correct: 2,
      explanation: "Spectrum analyzers examine wireless frequency usage and identify interference sources.",
      wrongExplanations: ["Cable testers test physical cables.", "Protocol analyzers examine packet data.", null, "TDRs test cable faults."],
      topic: "5.3 — Wireless tools"
    },
    {
      id: 181,
      question: "What is a common symptom of a switching loop?",
      choices: ["Slow speeds", "Broadcast storm", "DNS failure", "IP conflicts"],
      correct: 1,
      explanation: "Switching loops cause broadcast storms that flood the network with traffic.",
      wrongExplanations: ["Loops cause extreme congestion, not just slow speeds.", null, "DNS failure is unrelated to switching loops.", "IP conflicts are addressing issues."],
      topic: "5.4 — Switching loops"
    },
    {
      id: 182,
      question: "Which methodology step comes after identifying the problem?",
      choices: ["Document findings", "Establish a theory", "Implement solution", "Verify functionality"],
      correct: 1,
      explanation: "After identifying the problem, establish a theory of probable cause.",
      wrongExplanations: ["Documentation is the last step.", null, "Implementation comes after planning.", "Verification comes after implementation."],
      topic: "5.1 — Troubleshooting steps"
    },
    {
      id: 183,
      question: "What does packet loss indicate?",
      choices: ["Perfect network", "Congestion, errors, or hardware issues", "Fast speeds", "Good connectivity"],
      correct: 1,
      explanation: "Packet loss indicates network congestion, transmission errors, or faulty hardware.",
      wrongExplanations: ["Packet loss indicates problems.", null, "Packet loss degrades performance.", "Packet loss indicates connectivity problems."],
      topic: "5.4 — Performance issues"
    },
    {
      id: 184,
      question: "Which issue causes slow network performance?",
      choices: ["Bandwidth saturation", "Duplicate IPs", "Wrong VLAN", "Rogue DHCP"],
      correct: 0,
      explanation: "Bandwidth saturation from too much traffic causes slow network performance.",
      wrongExplanations: [null, "Duplicate IPs cause connectivity issues.", "Wrong VLAN causes isolation, not slowness.", "Rogue DHCP causes addressing issues."],
      topic: "5.4 — Bandwidth issues"
    },
    {
      id: 185,
      question: "What tool identifies cable type and pinout?",
      choices: ["Protocol analyzer", "Cable certifier", "Multimeter", "Spectrum analyzer"],
      correct: 1,
      explanation: "Cable certifiers identify cable types, verify pinouts, and test against standards.",
      wrongExplanations: ["Protocol analyzers examine network traffic.", null, "Multimeters test electrical properties.", "Spectrum analyzers test wireless signals."],
      topic: "5.3 — Cable certification"
    },
    {
      id: 186,
      question: "Which symptom indicates incorrect VLAN assignment?",
      choices: ["Slow speeds", "Unable to communicate with specific devices", "DNS failure", "High latency"],
      correct: 1,
      explanation: "Incorrect VLAN assignment isolates devices, preventing communication with others.",
      wrongExplanations: ["Wrong VLAN prevents communication, not just slows it.", null, "DNS failure is unrelated to VLAN configuration.", "VLAN issues cause isolation, not latency."],
      topic: "5.4 — VLAN issues"
    },
    {
      id: 187,
      question: "What does a solid amber link light indicate?",
      choices: ["Good connection", "Speed or connection issue", "Active transmission", "No power"],
      correct: 1,
      explanation: "Solid amber typically indicates a connection or speed negotiation problem.",
      wrongExplanations: ["Green indicates good connection.", null, "Flashing indicates transmission.", "No light indicates no power."],
      topic: "5.2 — LED indicators"
    },
    {
      id: 188,
      question: "Which command shows interface errors on Cisco?",
      choices: ["show errors", "show ip interface brief", "show interfaces", "display errors"],
      correct: 2,
      explanation: "The 'show interfaces' command displays detailed statistics including errors.",
      wrongExplanations: ["Not a valid command.", "'show ip interface brief' gives summary only.", null, "Not a valid Cisco command."],
      topic: "5.2 — Interface troubleshooting"
    },
    {
      id: 189,
      question: "What causes collisions in modern switched networks?",
      choices: ["Normal operation", "Duplex mismatch", "DNS issues", "Routing problems"],
      correct: 1,
      explanation: "In switched networks, collisions indicate duplex mismatch (half/full duplex conflict).",
      wrongExplanations: ["Collisions are abnormal in switched networks.", null, "DNS issues don't cause collisions.", "Routing is Layer 3, collisions are Layer 2."],
      topic: "5.4 — Duplex issues"
    },
    {
      id: 190,
      question: "Which issue results from incorrect subnet mask?",
      choices: ["Can communicate locally but not remotely", "No connectivity at all", "DNS failure", "Slow speeds"],
      correct: 0,
      explanation: "Wrong subnet masks cause devices to incorrectly determine which addresses are local vs remote.",
      wrongExplanations: [null, "Some communication may work.", "DNS is separate from subnet configuration.", "Subnet mask errors affect routing, not speed."],
      topic: "5.4 — Subnetting issues"
    },
    {
      id: 191,
      question: "What does jitter measure?",
      choices: ["Bandwidth", "Latency variation", "Packet loss", "Throughput"],
      correct: 1,
      explanation: "Jitter measures variation in latency, important for real-time applications like VoIP.",
      wrongExplanations: ["Bandwidth is maximum capacity.", null, "Packet loss is separate metric.", "Throughput is actual data rate."],
      topic: "5.4 — QoS metrics"
    },
    {
      id: 192,
      question: "Which protocol helps diagnose routing issues?",
      choices: ["ARP", "ICMP (ping/traceroute)", "DHCP", "DNS"],
      correct: 1,
      explanation: "ICMP, used by ping and traceroute, helps diagnose routing and connectivity issues.",
      wrongExplanations: ["ARP resolves MAC addresses.", null, "DHCP assigns IP addresses.", "DNS resolves domain names."],
      topic: "5.2 — Diagnostic protocols"
    },
    {
      id: 193,
      question: "What indicates a broadcast storm?",
      choices: ["Slow single connection", "Network-wide saturation and device crashes", "DNS issues", "Single device offline"],
      correct: 1,
      explanation: "Broadcast storms cause network-wide saturation, device overload, and crashes.",
      wrongExplanations: ["Broadcast storms affect entire network.", null, "DNS issues don't cause storms.", "Storms affect all devices."],
      topic: "5.4 — Broadcast storms"
    },
    {
      id: 194,
      question: "Which tool performs automated cable testing?",
      choices: ["Multimeter", "Cable certifier", "Protocol analyzer", "Toner probe"],
      correct: 1,
      explanation: "Cable certifiers perform comprehensive automated testing against industry standards.",
      wrongExplanations: ["Multimeters test manually.", null, "Protocol analyzers test traffic.", "Toner probes trace cables."],
      topic: "5.3 — Automated testing"
    },
    {
      id: 195,
      question: "What causes split horizon issues?",
      choices: ["DNS problems", "Routing loop prevention", "Cable issues", "DHCP conflicts"],
      correct: 1,
      explanation: "Split horizon prevents routing loops but can cause connectivity issues if misconfigured.",
      wrongExplanations: ["DNS is separate from routing.", null, "Split horizon is a routing mechanism.", "DHCP is unrelated to split horizon."],
      topic: "5.4 — Routing issues"
    },
    {
      id: 196,
      question: "Which issue causes asymmetric routing?",
      choices: ["Multiple paths with different metrics", "DNS failure", "Cable problems", "IP conflicts"],
      correct: 0,
      explanation: "Asymmetric routing occurs when forward and return paths differ due to multiple routes with different metrics.",
      wrongExplanations: [null, "DNS doesn't affect routing paths.", "Cable issues affect connectivity.", "IP conflicts are addressing issues."],
      topic: "5.4 — Routing problems"
    },
    {
      id: 197,
      question: "What does MTU mismatch cause?",
      choices: ["No connectivity", "Fragmentation and performance issues", "DNS failure", "IP conflicts"],
      correct: 1,
      explanation: "MTU mismatches cause packet fragmentation, reducing performance and potentially causing failures.",
      wrongExplanations: ["MTU issues don't prevent all connectivity.", null, "DNS is unrelated to MTU.", "MTU affects packet size, not addressing."],
      topic: "5.4 — MTU issues"
    },
    {
      id: 198,
      question: "Which step follows implementing a solution?",
      choices: ["Document findings", "Verify full system functionality", "Identify problem", "Establish theory"],
      correct: 1,
      explanation: "After implementing a solution, verify that full system functionality is restored.",
      wrongExplanations: ["Documentation comes after verification.", null, "Identification is the first step.", "Theory establishment comes early in process."],
      topic: "5.1 — Implementation verification"
    },
    {
      id: 199,
      question: "What indicates DNS resolution issues?",
      choices: ["Can ping by IP but not by name", "Cannot ping at all", "Slow speeds", "High latency"],
      correct: 0,
      explanation: "If ping works with IPs but not names, DNS resolution is failing.",
      wrongExplanations: [null, "No ping suggests connectivity issues.", "Slow speeds suggest bandwidth issues.", "High latency suggests congestion or distance."],
      topic: "5.4 — DNS troubleshooting"
    },
    {
      id: 200,
      question: "What is the final step in troubleshooting?",
      choices: ["Implement solution", "Test theory", "Document findings and actions", "Verify functionality"],
      correct: 2,
      explanation: "The final troubleshooting step is documenting findings, actions, and outcomes for future reference.",
      wrongExplanations: ["Implementation comes before verification.", "Testing theory happens earlier.", null, "Verification comes before documentation."],
      topic: "5.1 — Documentation"
    }
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
