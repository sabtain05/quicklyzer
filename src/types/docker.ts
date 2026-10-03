// src/types/docker.ts

export interface DockerfileData {
  file: string;
  baseImages: string[];
  exposedPorts: number[];
  hasMultiStage: boolean;
  hasHealthCheck: boolean;
  hasNonRootUser: boolean;
  hasVolume: boolean;
  stageCount: number;
}

export interface DockerComposeData {
  file: string;
  services: string[];
  hasVolumes: boolean;
  hasNetworks: boolean;
}

export interface DockerIntelligence {
  hasDocker: boolean;
  hasDockerCompose: boolean;
  hasKubernetes: boolean;
  
  dockerfiles: DockerfileData[];
  composeFiles: DockerComposeData[];
  
  dockerScore: number;
  containerHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
  recommendations: string[];
}