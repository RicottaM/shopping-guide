import { Edge } from "../models/edge.model";
import { Graph } from "../models/graph.model";
import { Section } from "../models/section.model";

class PathFindingService {
    edges: Edge[] = [
        // Alejki pionowe
        { v1: 1, v2: 9, weight: 2 },
        { v1: 2, v2: 10, weight: 1 },
        { v1: 3, v2: 11, weight: 2 },
        { v1: 4, v2: 12, weight: 1 },
        { v1: 5, v2: 13, weight: 2 },
        { v1: 6, v2: 14, weight: 1 },
        { v1: 7, v2: 15, weight: 2 },
        { v1: 8, v2: 16, weight: 1 },
        { v1: 9, v2: 17, weight: 1 },
        { v1: 10, v2: 18, weight: 2 },
        { v1: 11, v2: 19, weight: 1 },
        { v1: 12, v2: 20, weight: 2 },
        { v1: 13, v2: 21, weight: 1 },
        { v1: 14, v2: 22, weight: 3 },
        { v1: 15, v2: 23, weight: 2 },
        { v1: 16, v2: 24, weight: 1 },
        // Alejki poziome
        { v1: 1, v2: 2, weight: 3 },
        { v1: 2, v2: 3, weight: 3 },
        { v1: 3, v2: 4, weight: 3 },
        { v1: 4, v2: 5, weight: 3 },
        { v1: 5, v2: 6, weight: 3 },
        { v1: 6, v2: 7, weight: 3 },
        { v1: 7, v2: 8, weight: 3 },
        { v1: 9, v2: 10, weight: 2 },
        { v1: 10, v2: 11, weight: 3 },
        { v1: 11, v2: 12, weight: 3 },
        { v1: 12, v2: 13, weight: 3 },
        { v1: 13, v2: 14, weight: 3 },
        { v1: 14, v2: 15, weight: 3 },
        { v1: 15, v2: 16, weight: 3 },
        { v1: 17, v2: 18, weight: 2 },
        { v1: 18, v2: 19, weight: 3 },
        { v1: 19, v2: 20, weight: 3 },
        { v1: 20, v2: 21, weight: 3 },
        { v1: 21, v2: 22, weight: 3 },
        { v1: 22, v2: 23, weight: 3 },
        { v1: 23, v2: 24, weight: 3 },
        { v1: 25, v2: 26, weight: 2 },
        { v1: 26, v2: 27, weight: 3 },
        { v1: 27, v2: 28, weight: 3 },
        { v1: 28, v2: 29, weight: 3 },
        { v1: 29, v2: 30, weight: 3 },
        { v1: 30, v2: 31, weight: 3 },
        { v1: 31, v2: 32, weight: 3 }
    ];
    graph: Graph = {};

    constructor() { }

    getPath(sections: Section[], currentSection: number): number[] | undefined {
        this.graph = this.generateGraph(this.edges);
        try {
            let sectionNumbers: number[] = sections.map((section) => section.section_id);
            const initialPath = this.greedyPath(currentSection, sectionNumbers);
            const optimizedPath = this.twoOpt(initialPath);

            return optimizedPath;
        } catch (error: any) {
            console.error("Error:", error.message);
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

    reconstructPath(
        previous: { [key: number]: number | null },
        start: number,
        end: number
    ): number[] | null {
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
                throw new Error(
                    `No path found from vertex ${currentVertex} to any remaining vertex`
                );
            }

            const pathSegment = this.reconstructPath(previous, currentVertex, nextVertex);
            if (!pathSegment) {
                throw new Error(
                    `No valid path segment found from vertex ${currentVertex} to vertex ${nextVertex}`
                );
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
        return path
            .slice(0, i)
            .concat(path.slice(i, j + 1).reverse(), path.slice(j + 1));
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

const pathFindingService = new PathFindingService();
export default pathFindingService;
