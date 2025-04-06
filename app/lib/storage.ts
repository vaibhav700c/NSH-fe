// lib/storage.ts
import { Container } from "../types/container";
import { Item } from "../types/item";
import { PlacementRequestItem, PlacementRequestContainer, Placement, Rearrangement, Position } from "../types/placement";
import { Log } from "../types/log";
import { ReturnPlanItem, RetrievalStep, ReturnManifest } from "../types/waste"; // Import waste types

const containers: Container[] = [];
const items: Item[] = [];
const logs: Log[] = [];

export function initializeContainers(newContainers: PlacementRequestContainer[]) {
  containers.splice(0, containers.length, ...newContainers.map((c) => ({
    containerId: c.containerId,
    zone: c.zone,
    width: c.width,
    depth: c.depth,
    height: c.height,
    availableSpace: { width: c.width, depth: c.depth, height: c.height },
  })));
  logs.push({
    timestamp: new Date().toISOString(),
    action: "initialize_containers",
    details: `${newContainers.length} containers added`,
  });
}

export function addItems(newItems: PlacementRequestItem[]) {
  items.push(...newItems.map((item) => ({
    itemId: item.itemId,
    name: item.name,
    width: item.width,
    depth: item.depth,
    height: item.height,
    priority: item.priority,
    expiryDate: item.expiryDate,
    usageLimit: item.usageLimit,
    usageCount: item.usageLimit,
    preferredZone: item.preferredZone,
    containerId: "",
    position: { startCoordinates: { width: 0, depth: 0, height: 0 }, endCoordinates: { width: 0, depth: 0, height: 0 } },
  })));
  logs.push({
    timestamp: new Date().toISOString(),
    action: "add_items",
    details: `${newItems.length} items added`,
  });
}

export function calculatePlacement(requestItems: PlacementRequestItem[], requestContainers: PlacementRequestContainer[]): { placements: Placement[]; rearrangements: Rearrangement[] } {
  const placedItems = requestItems.map((item) => ({
    ...item,
    usageCount: item.usageLimit,
    containerId: "",
    position: { startCoordinates: { width: 0, depth: 0, height: 0 }, endCoordinates: { width: 0, depth: 0, height: 0 } },
  })) as Item[];
  placedItems.sort((a, b) => b.priority - a.priority);

  const placements: Placement[] = [];
  const rearrangements: Rearrangement[] = [];

  for (const item of placedItems) {
    const preferredContainers = requestContainers.filter((c) => c.zone === item.preferredZone);
    const container = preferredContainers.length > 0 ? preferredContainers[0] : requestContainers[0];
    if (container) {
      const start = { width: 0, depth: 0, height: 0 };
      const end = { width: item.width, depth: item.depth, height: item.height };
      const placementStep = placements.length + 1; // Use step here
      placements.push({
        itemId: item.itemId,
        containerId: container.containerId,
        position: { startCoordinates: start, endCoordinates: end },
      });
      item.containerId = container.containerId;
      item.position = { startCoordinates: start, endCoordinates: end };
      logs.push({
        timestamp: new Date().toISOString(),
        action: "place_item",
        details: `Step ${placementStep}: Item ${item.name} placed in ${container.containerId}`,
      });
    }
  }
  items.splice(0, items.length, ...placedItems);
  return { placements, rearrangements };
}

export function searchItems(itemId?: string, itemName?: string, userId?: string): Item | undefined {
  const item = items.find((item) => (itemId && item.itemId === itemId) || (itemName && item.name === itemName));
  if (item && userId) {
    logs.push({
      timestamp: new Date().toISOString(),
      action: "search_item",
      details: `Item ${item.name} searched by ${userId}`,
    });
  }
  return item;
}

export function retrieveItem(itemId: string, userId: string, timestamp: string): boolean {
  const item = items.find((i) => i.itemId === itemId);
  if (item && item.usageCount > 0) {
    item.usageCount--;
    logs.push({
      timestamp,
      action: "retrieve_item",
      details: `Item ${item.name} retrieved by ${userId}, usage count: ${item.usageCount}`,
    });
    return true;
  }
  return false;
}

export function placeItem(itemId: string, userId: string, containerId: string, position: Position, timestamp: string): boolean {
  const item = items.find((i) => i.itemId === itemId);
  if (item) {
    item.containerId = containerId;
    item.position = position;
    logs.push({
      timestamp,
      action: "place_item",
      details: `Item ${item.name} placed in ${containerId} by ${userId}`,
    });
    return true;
  }
  return false;
}

export function identifyWaste(): Item[] {
  const now = new Date();
  return items.filter((item) => new Date(item.expiryDate) < now || item.usageCount <= 0).map((item) => {
    logs.push({
      timestamp: new Date().toISOString(),
      action: "identify_waste",
      details: `Item ${item.name} flagged as waste`,
    });
    return item;
  });
}

export function planWasteReturn(undockingContainerId: string, maxWeight: number, undockingDate: string): { returnPlan: ReturnPlanItem[]; retrievalSteps: RetrievalStep[]; returnManifest: ReturnManifest } {
  const waste = identifyWaste();
  const totalWeight = waste.reduce((sum, item) => sum + (item.width * item.depth * item.height * 0.1), 0);
  if (totalWeight > maxWeight) return { returnPlan: [], retrievalSteps: [], returnManifest: { undockingContainerId, undockingDate, returnItems: [], totalVolume: 0, totalWeight: 0 } };

  const returnPlan: ReturnPlanItem[] = waste.map((item, index) => ({
    step: index + 1,
    itemId: item.itemId,
    itemName: item.name,
    fromContainer: item.containerId,
    toContainer: undockingContainerId,
  }));
  const retrievalSteps: RetrievalStep[] = waste.map((item, index) => ({
    step: index + 1,
    action: "retrieve",
    itemId: item.itemId,
    itemName: item.name,
  }));
  const returnManifest: ReturnManifest = {
    undockingContainerId,
    undockingDate,
    returnItems: waste.map((item) => ({ itemId: item.itemId, name: item.name, reason: item.usageCount <= 0 ? "Out of Uses" : "Expired" })),
    totalVolume: waste.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0),
    totalWeight,
  };
  logs.push({
    timestamp: new Date().toISOString(),
    action: "plan_waste_return",
    details: `${waste.length} items planned for return`,
  });
  return { returnPlan, retrievalSteps, returnManifest };
}

export function completeUndocking(undockingContainerId: string, timestamp: string): number {
  const waste = items.filter((item) => item.containerId === undockingContainerId);
  items.splice(0, items.length, ...items.filter((item) => item.containerId !== undockingContainerId));
  logs.push({
    timestamp,
    action: "complete_undocking",
    details: `${waste.length} items removed from ${undockingContainerId}`,
  });
  return waste.length;
}

export function simulateDay(numOfDays: number, itemsToBeUsed: { itemId: string; name: string }[], toTimestamp?: string) {
  const now = new Date();
  let newDate: Date;
  if (toTimestamp) {
    newDate = new Date(toTimestamp);
    numOfDays = Math.ceil((newDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  } else {
    newDate = new Date(now.getTime() + numOfDays * 24 * 60 * 60 * 1000);
  }
  const changes = {
    itemsUsed: [] as { itemId: string; name: string; remainingUses: number }[],
    itemsExpired: [] as { itemId: string; name: string }[],
    itemsDepletedToday: [] as { itemId: string; name: string }[],
  };

  itemsToBeUsed.forEach(({ itemId, name }) => {
    const item = items.find((i) => i.itemId === itemId || i.name === name);
    if (item && item.usageCount > 0) {
      item.usageCount--;
      changes.itemsUsed.push({ itemId: item.itemId, name: item.name, remainingUses: item.usageCount });
      if (item.usageCount === 0) changes.itemsDepletedToday.push({ itemId: item.itemId, name: item.name });
    }
  });

  items.forEach((item) => {
    if (new Date(item.expiryDate) < newDate) {
      changes.itemsExpired.push({ itemId: item.itemId, name: item.name });
    }
  });

  logs.push({
    timestamp: newDate.toISOString(),
    action: "simulate_day",
    details: `Simulated ${numOfDays} days`,
  });
  return { newDate: newDate.toISOString(), changes };
}

export function exportArrangement(): string {
  return items.map((item) => `${item.itemId},${item.containerId},(${item.position.startCoordinates.width},${item.position.startCoordinates.depth},${item.position.startCoordinates.height}),(${item.position.endCoordinates.width},${item.position.endCoordinates.depth},${item.position.endCoordinates.height})`).join("\n");
}

export function getLogs(startDate?: string, endDate?: string, itemId?: string, userId?: string, actionType?: string): Log[] {
  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return (
      (!startDate || logDate >= new Date(startDate)) &&
      (!endDate || logDate <= new Date(endDate)) &&
      (!itemId || log.details.includes(itemId)) &&
      (!userId || log.details.includes(userId)) &&
      (!actionType || log.action === actionType)
    );
  });
}

export function getContainers() {
  return containers;
}

export function getItems() {
  return items;
}