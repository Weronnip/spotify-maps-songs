/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { Songs } from './songs.types';
import { useRef, useEffect } from 'react';
import cosSimilartity from './similarity';

function GraphVisualizer({ data }: { data: Songs[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Фильтруем данные, оставляем только те, где названия и имена артиста корректны
    const validData = data.filter(song => song.Track && song.Artist);

    // Проверка валидных данных
    console.log('Valid Data:', validData);

    // Создание узлов
    const nodes: any = validData.map((song, index) => ({
      id: index,
      track: song.Track,
      artist: song.Artist,
      streams: song.Spotify_Streams,
    }));

    // Создание связей на основе сходства
    const links: any = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosSimilartity(validData[i], validData[j]);
        // Убираем порог сходства, чтобы всегда добавлять связи
        links.push({ source: i, target: j, similarity });
      }
    }

    console.log('Nodes:', nodes);
    console.log('Links:', links);

    // Настройка для масштабирования
    const zoom: any = d3.zoom().on("zoom", (event) => {
      svg.selectAll("g").attr("transform", event.transform);
    });

    svg.call(zoom);

    // Создание симуляции силы для распределения узлов
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Добавляем группы для узлов и связей
    const g = svg.append("g");

    // Отрисовка связей
    const linkElements = g.selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", (d: any) => d3.interpolateBlues(d.similarity))
      .attr("stroke-width", 2);

    // Отрисовка узлов
    const nodeElements = g.selectAll("g.node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node");

    nodeElements.append("circle")
      .attr("r", (d: any) => Math.sqrt(d.streams) / 1000 || 5)
      .attr("fill", d3.interpolateRainbow(Math.random()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    nodeElements.append("text")
      .attr("dy", -20)
      .attr("text-anchor", "middle")
      .text((d: any) => d.track);

    nodeElements.append("text")
      .attr("dy", 20)
      .attr("text-anchor", "middle")
      .text((d: any) => d.artist)
      .style("font-size", "0.8rem");

    // Добавляем всплывающее окно
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "#ffffff4d")
      .style("border-radius", "2px")
      .style("color", "#e9e9e9")
      .style("font-size", "12px")
      .style("padding", "5px")
      .style("display", "none");

    nodeElements.on("mouseover", (event, d:any) => {
      tooltip.transition().duration(200).style("display", "block");
      tooltip.html(`<strong>Track:</strong> ${d.track}<br><strong>Artist:</strong> ${d.artist}<br><strong>Streams:</strong> ${d.streams}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    }).on("mouseout", () => {
      tooltip.transition().duration(500).style("display", "none");
    });
    // Запуск симуляции
    simulation.on("tick", async () => {
      linkElements
        .attr("x1", (d: any) => nodes[d.source].x)
        .attr("y1", (d: any) => nodes[d.source].y)
        .attr("x2", (d: any) => nodes[d.target].x)
        .attr("y2", (d: any) => nodes[d.target].y);

      nodeElements
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [data]);

  return (
    <svg ref={svgRef} width="1000px" height="1000px" style={{ border: "1px solid black" }}></svg>
  );
}

export default GraphVisualizer;