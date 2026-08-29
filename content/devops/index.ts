import { TopicData } from "../../types/content";

/**
 * Lesson content for the DevOps & Internet track.
 *
 * Every lesson page already exists and renders its header, metadata and
 * prev/next navigation from `lib/devops-course-data.ts`. A lesson shows the
 * "Content Coming Soon" placeholder until it gets an entry here.
 *
 * To write a lesson:
 *   1. create `content/devops/<module-folder>/<nn>-<lesson-id>.tsx`
 *      exporting a `TopicData` object (see `content/foundations/topics` for the
 *      house style: 8 sections, Theory, Visual, Real Example, Project Example,
 *      Hands-on, Quiz, Assignment, Recap),
 *   2. import it below and map it to the lesson id used in
 *      `lib/devops-course-data.ts`.
 */
import { binaryAndDataContent } from "./01-computer-fundamentals/01-binary-and-data";
import { cpuBasicsContent } from "./01-computer-fundamentals/02-cpu-basics";
import { memoryAndRamContent } from "./01-computer-fundamentals/03-memory-and-ram";
import { operatingSystemBasicsContent } from "./01-computer-fundamentals/05-operating-system-basics";
import { processVsThreadContent } from "./01-computer-fundamentals/06-process-vs-thread";
import { howAProgramRunsContent } from "./01-computer-fundamentals/07-how-a-program-runs";
import { storageBasicsContent } from "./01-computer-fundamentals/04-storage-basics";
import { clientServerIspContent } from "./02-internet-fundamentals/02-client-server-isp";
import { osNetworkingContent } from "./02-internet-fundamentals/03-os-networking";
import { endToEndRequestJourneyContent } from "./02-internet-fundamentals/06-end-to-end-request-journey";
import { networkBasicsContent } from "./03-computer-networking/01-network-basics";
import { arpProtocolContent } from "./03-computer-networking/04-arp-protocol";
import { ipAddressContent } from "./03-computer-networking/05-ip-address";
import { publicVsPrivateIpContent } from "./03-computer-networking/06-public-vs-private-ip";
import { subnetMaskContent } from "./03-computer-networking/07-subnet-mask";
import { gatewayContent } from "./03-computer-networking/08-gateway";
import { dhcpContent } from "./03-computer-networking/09-dhcp";
import { natPatContent } from "./03-computer-networking/10-nat-pat";
import { phoneInternetConnectionContent } from "./03-computer-networking/11-phone-internet-connection";
import { macAddressContent } from "./03-computer-networking/03-mac-address";
import { routerSwitchHubContent } from "./03-computer-networking/02-router-switch-hub";
import { howDataTravelsContent } from "./02-internet-fundamentals/05-how-data-travels";
import { packetLatencyBandwidthContent } from "./02-internet-fundamentals/04-packet-latency-bandwidth";
import { whatIsInternetContent } from "./02-internet-fundamentals/01-what-is-internet";

export const devopsContentMap: Record<string, TopicData> = {
  // Module 01, Computer Fundamentals
  "binary-and-data": binaryAndDataContent,
  "cpu-basics": cpuBasicsContent,
  "memory-and-ram": memoryAndRamContent,
  "storage-basics": storageBasicsContent,
  "operating-system-basics": operatingSystemBasicsContent,
  "process-vs-thread": processVsThreadContent,
  "how-a-program-runs": howAProgramRunsContent,

  // Module 02, Internet Fundamentals
  "what-is-internet": whatIsInternetContent,
  "client-server-isp": clientServerIspContent,
  "os-networking": osNetworkingContent,
  "packet-latency-bandwidth": packetLatencyBandwidthContent,
  "how-data-travels": howDataTravelsContent,
  "end-to-end-request-journey": endToEndRequestJourneyContent,

  // Module 03, Computer Networking
  "network-basics": networkBasicsContent,
  "router-switch-hub": routerSwitchHubContent,
  "mac-address": macAddressContent,
  "arp-protocol": arpProtocolContent,
  "ip-address": ipAddressContent,
  "public-vs-private-ip": publicVsPrivateIpContent,
  "subnet-mask": subnetMaskContent,
  "gateway": gatewayContent,
  "dhcp": dhcpContent,
  "nat-pat": natPatContent,
  "phone-internet-connection": phoneInternetConnectionContent,
};
