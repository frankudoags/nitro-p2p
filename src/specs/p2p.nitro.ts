import type { HybridObject } from 'react-native-nitro-modules'

export type P2PPeer = {
  id: string       // unique peer identifier (UUID generated on each device at startup)
  name: string     // human-readable device name
  host: string     // IP address on LAN
  port: number     // TCP port the peer is listening on
}

export type P2PMessage = {
  fromPeerId: string
  data: string     // JSON string — callers handle serialisation
}

export interface P2P extends HybridObject<{
  ios: 'swift'
  android: 'kotlin'
}> {
  // ─── Identity ────────────────────────────────────────────────────────────
  /** Call once at startup. Sets the name broadcast to peers. */
  setDeviceName(name: string): void

  // ─── Lifecycle ───────────────────────────────────────────────────────────
  /**
   * Start advertising (UDP beacon + TCP server) and browsing simultaneously.
   * Both happen at once — every device is always discoverable while active.
   * @param servicePort  TCP port to bind (default 45678 if omitted)
   */
  start(servicePort?: number): void

  /** Stop all networking. Disconnects peers and stops advertising/browsing. */
  stop(): void

  // ─── Connection ──────────────────────────────────────────────────────────
  /** Open a TCP connection to a discovered peer. */
  connect(peerId: string): void

  /** Close the connection to a specific peer. */
  disconnect(peerId: string): void

  // ─── Messaging ───────────────────────────────────────────────────────────
  /** Send a string payload to one connected peer. */
  sendToPeer(peerId: string, data: string): void

  /** Broadcast a string payload to ALL currently connected peers. */
  broadcast(data: string): void

  // ─── State ───────────────────────────────────────────────────────────────
  /** Returns all peers currently visible via discovery (connected or not). */
  getDiscoveredPeers(): P2PPeer[]

  /** Returns all peers with an active TCP connection. */
  getConnectedPeers(): P2PPeer[]

  // ─── Callbacks ───────────────────────────────────────────────────────────
  /** A new peer appeared on the network (not yet connected). */
  onPeerDiscovered: ((peer: P2PPeer) => void) | null

  /** A previously discovered peer disappeared (or explicitly called stop). */
  onPeerLost: ((peerId: string) => void) | null

  /** TCP connection established with a peer (either direction). */
  onPeerConnected: ((peer: P2PPeer) => void) | null

  /** TCP connection closed with a peer (either direction). */
  onPeerDisconnected: ((peerId: string) => void) | null

  /** Inbound message from a connected peer. */
  onMessage: ((message: P2PMessage) => void) | null

  /** Any non-fatal error (log and surface to UI). */
  onError: ((code: string, message: string) => void) | null
}