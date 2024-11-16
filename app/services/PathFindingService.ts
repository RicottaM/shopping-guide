import { Edge } from '../models/edge.model';
import { Graph } from '../models/graph.model';
import { Section } from '../models/section.model';

class PathFindingService {
  storeId: number;
  edges: Edge[];
  graph: Graph = {};

  constructor(storeId: number, edges: Edge[]) {
    this.storeId = storeId;
    this.edges = edges;
  }

  getPath(sections: number[], currentSection: number): number[] | undefined {
    console.log('sections: ', sections);
    this.graph = this.generateGraph(this.edges);
    try {
      const initialPath = this.greedyPath(currentSection, sections);
      const optimizedPath = this.twoOpt(initialPath);

      console.log('opti: ', optimizedPath);
      return optimizedPath;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error: ', error.message);
      } else {
        console.error('Error: ', error);
      }
    }
  }

  generateGraph(edges: Edge[]): Graph {
    const graph: Graph = {};
    for (const edge of edges) {
      if (!graph[edge.v1]) graph[edge.v1] = {};
      if (!graph[edge.v2]) graph[edge.v2] = {};
      graph[edge.v1][edge.v2] = edge.weight;
      graph[edge.v2][edge.v1] = edge.weight;
    }
    return graph;
  }

  dijkstra(
    graph: Graph,
    start: number
  ): {
    distances: { [key: number]: number };
    previous: { [key: number]: number | null };
  } {
    const distances: { [key: number]: number } = {};
    const previous: { [key: number]: number | null } = {};
    const queue: [number, number][] = [];

    for (const vertex in graph) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }

    distances[start] = 0;
    queue.push([0, start]);

    while (queue.length > 0) {
      queue.sort((a, b) => a[0] - b[0]);
      const [currentDistance, currentVertex] = queue.shift()!;

      if (currentDistance > distances[currentVertex]) continue;

      for (const neighbor in graph[currentVertex]) {
        const distance = currentDistance + graph[currentVertex][neighbor];

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = currentVertex;
          queue.push([distance, parseInt(neighbor)]);
        }
      }
    }

    return { distances, previous };
  }

  reconstructPath(previous: { [key: number]: number | null }, start: number, end: number): number[] | null {
    const path: number[] = [];
    let current: number | null = end;

    while (current !== null) {
      path.push(current);
      current = previous[current];
    }

    path.reverse();
    return path[0] === start ? path : null;
  }

  greedyPath(start: number, vertices: number[]): number[] {
    const path: number[] = [start];
    let currentVertex = start;
    const verticesSet = new Set(vertices);
    verticesSet.delete(start);

    while (verticesSet.size > 0) {
      const { distances, previous } = this.dijkstra(this.graph, currentVertex);
      let nextVertex: number | null = null;
      let minDistance = Infinity;

      verticesSet.forEach((v) => {
        if (distances[v] < minDistance) {
          nextVertex = v;
          minDistance = distances[v];
        }
      });

      if (nextVertex === null || distances[nextVertex] === Infinity) {
        throw new Error(`No path found from vertex ${currentVertex} to any remaining vertex`);
      }

      const pathSegment = this.reconstructPath(previous, currentVertex, nextVertex);
      if (!pathSegment) {
        throw new Error(`No valid path segment found from vertex ${currentVertex} to vertex ${nextVertex}`);
      }

      path.push(...pathSegment.slice(1)); // Avoid repeating the current vertex
      currentVertex = nextVertex;
      verticesSet.delete(nextVertex);
    }

    return path;
  }

  calculatePathWeight(path: number[]): number {
    let totalWeight = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      if (this.graph[from][to] !== undefined) {
        totalWeight += this.graph[from][to];
      } else {
        throw new Error(`No edge between ${from} and ${to}`);
      }
    }
    return totalWeight;
  }

  twoOptSwap(path: number[], i: number, j: number): number[] {
    return path.slice(0, i).concat(path.slice(i, j + 1).reverse(), path.slice(j + 1));
  }

  twoOpt(path: number[]): number[] {
    let bestPath = path;
    let bestWeight = this.calculatePathWeight(bestPath);
    let improved = true;

    while (improved) {
      improved = false;
      for (let i = 1; i < path.length - 2; i++) {
        for (let j = i + 1; j < path.length - 1; j++) {
          const newPath = this.twoOptSwap(bestPath, i, j);
          let newWeight;
          try {
            newWeight = this.calculatePathWeight(newPath);
          } catch (error) {
            continue;
          }
          if (newWeight < bestWeight) {
            bestPath = newPath;
            bestWeight = newWeight;
            improved = true;
          }
        }
      }
    }

    return bestPath;
  }
}

export default PathFindingService;
