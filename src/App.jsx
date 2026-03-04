import { useState, useEffect } from "react";

const phases = [
  {
    id: 1, code: "PHASE_01", title: "Build a Homelab", icon: "⬡", color: "#00ff88",
    difficulty: "ENTRY", hours: "40–80 hrs",
    description: "Your war room. The foundation everything else builds on.",
    objectives: [
      "Provision a hypervisor: Proxmox VE or VMware ESXi",
      "Spin up isolated network segments (VLANs) for attack & defense",
      "Deploy pfSense/OPNsense as your border firewall/router",
      "Stand up core VMs: Kali Linux, Ubuntu Server, Windows Server 2022",
      "Configure a vulnerable target network (Metasploitable, DVWA, VulnHub VMs)",
      "Document your topology with draw.io or Lucidchart",
    ],
    tools: ["Proxmox VE", "VMware ESXi", "pfSense", "Kali Linux", "VirtualBox"],
    tip: "Spend money on RAM. 32GB minimum. Cybersecurity runs on RAM.",
  },
  {
    id: 2, code: "PHASE_02", title: "CTFs & Challenges", icon: "⚑", color: "#ff6b35",
    difficulty: "INTERMEDIATE", hours: "Ongoing",
    description: "Sharpen your edge against real adversarial puzzles.",
    objectives: [
      "Complete 20+ rooms on TryHackMe (start: Pre-Security path)",
      "Solve 10 retired HackTheBox machines",
      "Participate in live CTF events via CTFtime.org",
      "Build your own CTF challenge in a category you've mastered",
      "Master binary exploitation, web, forensics, and crypto categories",
      "Write detailed writeups for every machine you own",
    ],
    tools: ["TryHackMe", "HackTheBox", "PicoCTF", "CTFtime", "pwn.college"],
    tip: "Writeups are your portfolio. Write even when you used hints.",
  },
  {
    id: 3, code: "PHASE_03", title: "Vulnerability Assessors", icon: "◈", color: "#a855f7",
    difficulty: "INTERMEDIATE", hours: "20–40 hrs",
    description: "Automate the hunt. Know every inch of your attack surface.",
    objectives: [
      "Install and configure OpenVAS / Greenbone Vulnerability Manager",
      "Run authenticated vs unauthenticated scans and compare results",
      "Integrate Nessus Essentials against your homelab targets",
      "Parse and triage CVE findings by CVSS score",
      "Build a remediation tracker (spreadsheet or Notion)",
      "Schedule recurring scans and diff reports week-over-week",
    ],
    tools: ["OpenVAS", "Nessus Essentials", "Nikto", "Nmap NSE", "Nuclei"],
    tip: "False positives are noise. Learn to validate every finding manually.",
  },
  {
    id: 4, code: "PHASE_04", title: "SMB Credential Scanner", icon: "⌬", color: "#facc15",
    difficulty: "ADVANCED", hours: "15–25 hrs",
    description: "Build the tool. Hunt hardcoded credentials across SMB shares.",
    objectives: [
      "Write a Python scanner using impacket to enumerate SMB shares",
      "Implement credential stuffing from a wordlist against discovered shares",
      "Recursively traverse share contents and flag config/script files",
      "Add regex patterns to detect hardcoded passwords & API keys",
      "Output results as JSON and generate HTML report",
      "Test ethically against your own homelab Windows VMs",
    ],
    tools: ["Python", "Impacket", "CrackMapExec", "Metasploit", "smbclient"],
    tip: "Always build a whitelist. Scanners without scope controls are dangerous.",
  },
  {
    id: 5, code: "PHASE_05", title: "Custom C2 Server", icon: "⬢", color: "#f43f5e",
    difficulty: "ADVANCED", hours: "30–60 hrs",
    description: "Understand the adversary's infrastructure from the inside.",
    objectives: [
      "Study existing C2 frameworks: Cobalt Strike, Havoc, Sliver, Metasploit",
      "Build a minimal HTTP C2 in Python: beacon → task → response loop",
      "Implement basic obfuscation: Base64 + XOR agent communications",
      "Add operator panel (Flask/FastAPI) with live agent management",
      "Simulate lateral movement commands: shell, upload, download, screenshot",
      "Document detection signatures your C2 generates (for blue team use)",
    ],
    tools: ["Python", "Havoc C2", "Sliver", "Metasploit", "Cobalt Strike (trial)"],
    tip: "Build to understand detection, not to evade it. Red team mindset, blue team purpose.",
  },
  {
    id: 6, code: "PHASE_06", title: "Burp Suite & Extensions", icon: "⊕", color: "#38bdf8",
    difficulty: "INTERMEDIATE", hours: "20–35 hrs",
    description: "Own the web layer. Every request, every response, your playground.",
    objectives: [
      "Master Burp Suite Pro: Proxy, Repeater, Intruder, Scanner",
      "Complete PortSwigger Web Security Academy (all 250+ labs)",
      "Write a Burp extension in Python/Java: custom scanner check",
      "Build or configure a custom browser profile for testing",
      "Chain IDOR + SSRF + XSS in a real-world-style exploit chain",
      "Practice on OWASP WebGoat and Juice Shop",
    ],
    tools: ["Burp Suite Pro", "OWASP ZAP", "PortSwigger Academy", "Firefox DevTools", "Caido"],
    tip: "PortSwigger Academy is the best free web security curriculum on the internet. Do all of it.",
  },
  {
    id: 7, code: "PHASE_07", title: "SIEM & Open Source Tools", icon: "⬟", color: "#34d399",
    difficulty: "ADVANCED", hours: "40–70 hrs",
    description: "See everything. The defender's all-seeing eye.",
    objectives: [
      "Deploy Elasticsearch + Kibana stack in your homelab",
      "Install Splunk Free and ingest Windows Event Logs via Universal Forwarder",
      "Set up Wazuh as your open-source SIEM/XDR platform",
      "Configure Zeek + Suricata for network-level detection",
      "Build dashboards: login failures, lateral movement, privilege escalation",
      "Write custom detection rules in Sigma format",
    ],
    tools: ["Elastic SIEM", "Splunk Free", "Wazuh", "Graylog", "Zeek"],
    tip: "Tune your rules relentlessly. A SIEM drowning in alerts detects nothing.",
  },
  {
    id: 8, code: "PHASE_08", title: "Log Collection & Attack Simulation", icon: "◎", color: "#fb923c",
    difficulty: "ADVANCED", hours: "25–45 hrs",
    description: "Attack your own network. Watch it light up. Learn from what you see.",
    objectives: [
      "Deploy Sysmon on all Windows hosts with SwiftOnSecurity config",
      "Forward logs via Beats/Fluentd to your central SIEM",
      "Run Atomic Red Team test cases mapped to MITRE ATT&CK",
      "Simulate full kill chain: recon → initial access → persistence → exfil",
      "Validate each attack stage generates detectable log artifacts",
      "Build a detection coverage map against ATT&CK Navigator",
    ],
    tools: ["Sysmon", "Atomic Red Team", "MITRE ATT&CK", "Caldera", "Metasploit"],
    tip: "If your simulation doesn't show up in your SIEM, you have a logging gap. Fix it.",
  },
  {
    id: 9, code: "PHASE_09", title: "Hands-On Experience", icon: "◉", color: "#c084fc",
    difficulty: "ALL LEVELS", hours: "Ongoing",
    description: "No shortcuts. Reps build instincts. Instincts keep networks alive.",
    objectives: [
      "Contribute to an open-source security tool on GitHub",
      "Get certified: CompTIA Security+, CEH, OSCP, or eJPT",
      "Join a local DEF CON chapter or OWASP group",
      "Build a personal security blog documenting your projects",
      "Apply for bug bounty programs: HackerOne, Bugcrowd, Intigriti",
      "Shadow a SOC analyst or participate in a team CTF competition",
    ],
    tools: ["HackerOne", "Bugcrowd", "GitHub", "LinkedIn", "DEF CON Groups"],
    tip: "Document everything. Your GitHub and blog are your resume.",
  },
];

const diffColors = {
  ENTRY: "#00ff88", INTERMEDIATE: "#facc15", ADVANCED: "#f43f5e", "ALL LEVELS": "#a855f7",
};

export default function CyberSecGuide() {
  const [active, setActive] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const selected = phases.find((p) => p.id === active);

  const handleSelect = (id) => {
    setActive(id);
    if (window.innerWidth < 768) setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    setActive(null);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050a0f", color: "#e2e8f0",
      fontFamily: "'Courier New', monospace", overflowX: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {(!isMobile || !showDetail) && (
          <div style={{
            borderBottom: "1px solid rgba(0,255,136,0.2)",
            padding: isMobile ? "16px 14px" : "32px 48px 24px",
            background: "rgba(0,255,136,0.03)", flexShrink: 0,
          }}>
            <div style={{ fontSize: "9px", color: "#00ff88", letterSpacing: "3px", marginBottom: "6px", opacity: 0.7 }}>
              ▸ OPERATIONAL SECURITY CURRICULUM v2.0 ◂
            </div>
            <h1 style={{
              fontSize: isMobile ? "20px" : "clamp(26px, 4vw, 44px)",
              fontWeight: "900", letterSpacing: "-0.5px", margin: 0, lineHeight: 1.15,
              color: "#fff", textShadow: "0 0 40px rgba(0,255,136,0.3)",
            }}>
              THE ULTIMATE <span style={{ color: "#00ff88" }}>CYBERSECURITY</span> HOMELAB GUIDE
            </h1>
            <div style={{ marginTop: "8px", fontSize: "10px", color: "#64748b", letterSpacing: "2px" }}>
              9 PHASES · BUILD · BREAK · DEFEND · REPEAT
            </div>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden", minHeight: 0 }}>

          {(!isMobile || !showDetail) && (
            <div style={{
              width: isMobile ? "100%" : "clamp(220px, 25vw, 300px)",
              flexShrink: 0,
              borderRight: isMobile ? "none" : "1px solid rgba(0,255,136,0.15)",
              overflowY: "auto",
              padding: "12px 0",
            }}>
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  onClick={() => handleSelect(phase.id)}
                  style={{
                    padding: isMobile ? "12px 14px" : "13px 20px",
                    cursor: "pointer",
                    borderLeft: `3px solid ${active === phase.id ? phase.color : "transparent"}`,
                    background: active === phase.id ? `linear-gradient(90deg, ${phase.color}15, transparent)` : "transparent",
                    display: "flex", alignItems: "center", gap: "10px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "16px", color: active === phase.id ? phase.color : "#334155", minWidth: "18px", textAlign: "center" }}>
                    {phase.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: active === phase.id ? phase.color : "#475569", marginBottom: "2px" }}>
                      {phase.code}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: active === phase.id ? "#fff" : "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {phase.title}
                    </div>
                  </div>
                  {isMobile
                    ? <span style={{ color: "#475569", fontSize: "14px", flexShrink: 0 }}>›</span>
                    : <div style={{ fontSize: "8px", color: diffColors[phase.difficulty], background: `${diffColors[phase.difficulty]}15`, padding: "2px 6px", border: `1px solid ${diffColors[phase.difficulty]}30`, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {phase.difficulty}
                      </div>
                  }
                </div>
              ))}
            </div>
          )}

          {(!isMobile || showDetail) && (
            <div style={{ flex: 1, padding: isMobile ? "16px 14px" : "28px 36px", overflowY: "auto" }}>
              {isMobile && showDetail && (
                <button onClick={handleBack} style={{
                  background: "transparent", border: "1px solid rgba(0,255,136,0.3)",
                  color: "#00ff88", padding: "7px 14px", fontSize: "10px",
                  letterSpacing: "2px", cursor: "pointer", marginBottom: "18px",
                  fontFamily: "inherit", display: "block",
                }}>
                  ← BACK
                </button>
              )}

              {!selected ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "14px", opacity: 0.25 }}>
                  <div style={{ fontSize: "56px" }}>⬡</div>
                  <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#00ff88" }}>SELECT A PHASE</div>
                  <div style={{ fontSize: "10px", color: "#475569", textAlign: "center", lineHeight: 1.8 }}>
                    9 phases. From homelab to hands-on.<br />Each one builds the next.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: selected.color, marginBottom: "5px" }}>
                          {selected.code} ▸ {selected.hours}
                        </div>
                        <h2 style={{ fontSize: isMobile ? "20px" : "clamp(20px, 2.5vw, 30px)", fontWeight: "900", margin: 0, color: "#fff", textShadow: `0 0 30px ${selected.color}40` }}>
                          {selected.title}
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px", lineHeight: 1.6 }}>
                          {selected.description}
                        </p>
                      </div>
                      <div style={{ fontSize: isMobile ? "32px" : "44px", color: selected.color, textShadow: `0 0 30px ${selected.color}`, opacity: 0.8, flexShrink: 0 }}>
                        {selected.icon}
                      </div>
                    </div>
                    <div style={{ height: "1px", background: `linear-gradient(90deg, ${selected.color}60, transparent)`, marginTop: "16px" }} />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#475569", marginBottom: "10px" }}>▸ MISSION OBJECTIVES</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      {selected.objectives.map((obj, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "9px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: `2px solid ${selected.color}60` }}>
                          <span style={{ color: selected.color, fontSize: "9px", marginTop: "3px", minWidth: "16px", fontWeight: "900" }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.6 }}>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#475569", marginBottom: "10px" }}>▸ PRIMARY TOOLS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                      {selected.tools.map((tool, i) => (
                        <span key={i} style={{ padding: "4px 10px", fontSize: "10px", letterSpacing: "1px", fontWeight: "700", color: selected.color, background: `${selected.color}12`, border: `1px solid ${selected.color}40` }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "12px 16px", background: `${selected.color}08`, border: `1px solid ${selected.color}30`, borderLeft: `3px solid ${selected.color}` }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", color: selected.color, marginBottom: "6px" }}>▸ OPERATOR INTEL</div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic" }}>"{selected.tip}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{
          borderTop: "1px solid rgba(0,255,136,0.1)",
          padding: isMobile ? "10px 14px" : "12px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(0,0,0,0.4)", fontSize: "9px", letterSpacing: "2px", color: "#334155",
          flexWrap: "wrap", gap: "6px", flexShrink: 0,
        }}>
          <span>AUTHORIZED USE ONLY · ETHICAL HACKING CURRICULUM</span>
          <span style={{ color: "#00ff8840" }}>BUILD · BREAK · DEFEND</span>
        </div>
      </div>
    </div>
  );
}