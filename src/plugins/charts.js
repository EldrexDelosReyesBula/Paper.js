/**
 * PAPER CHARTS
 * Zero-dependency HTML5 Canvas charting plugin.
 */
(function() {
    paper.chart = (config) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        
        let container = paper.div('.paper-chart-container', canvas, Object.assign({
            style: { position: 'relative', width: '100%', height: '300px' }
        }, config.attrs || {}));

        let resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                let rect = entry.contentRect;
                canvas.width = rect.width;
                canvas.height = rect.height;
                renderChart();
            }
        });
        
        let renderChart = () => {
            let width = canvas.width;
            let height = canvas.height;
            if (width === 0 || height === 0) return;
            
            ctx.clearRect(0, 0, width, height);
            
            let type = config.type || 'bar';
            let data = config.data || [];
            let colors = config.colors || ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6'];
            
            if (type === 'bar') {
                let padding = 40;
                let barWidth = (width - padding * 2) / data.length - 10;
                let maxVal = Math.max(...data.map(d => typeof d === 'object' ? d.value : d));
                
                data.forEach((item, i) => {
                    let val = typeof item === 'object' ? item.value : item;
                    let label = typeof item === 'object' ? item.label : '';
                    let barHeight = (val / maxVal) * (height - padding * 2);
                    let x = padding + i * (barWidth + 10);
                    let y = height - padding - barHeight;
                    
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.beginPath();
                    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
                    ctx.fill();
                    
                    if (label) {
                        ctx.fillStyle = '#cbd5e1';
                        ctx.font = '12px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(label, x + barWidth / 2, height - padding + 20);
                    }
                });
            } else if (type === 'circle' || type === 'pie') {
                let cx = width / 2;
                let cy = height / 2;
                let radius = Math.min(cx, cy) - 20;
                
                if (type === 'circle') {
                    // Circular Progress
                    let val = typeof config.value === 'function' ? config.value() : (config.value || 0);
                    let max = config.max || 100;
                    let percent = val / max;
                    
                    // Background track
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                    ctx.lineWidth = 15;
                    ctx.stroke();
                    
                    // Progress arc
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * percent));
                    ctx.strokeStyle = colors[0];
                    ctx.lineCap = 'round';
                    ctx.lineWidth = 15;
                    ctx.stroke();
                    
                    // Text
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 24px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${Math.round(percent * 100)}%`, cx, cy);
                } else if (type === 'pie') {
                    let total = data.reduce((sum, d) => sum + (typeof d === 'object' ? d.value : d), 0);
                    let startAngle = -Math.PI / 2;
                    
                    data.forEach((item, i) => {
                        let val = typeof item === 'object' ? item.value : item;
                        let sliceAngle = (val / total) * Math.PI * 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(cx, cy);
                        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
                        ctx.closePath();
                        
                        ctx.fillStyle = colors[i % colors.length];
                        ctx.fill();
                        
                        startAngle += sliceAngle;
                    });
                }
            } else if (type === 'line') {
                let padding = 40;
                let maxVal = Math.max(...data.map(d => typeof d === 'object' ? d.value : d));
                let stepX = (width - padding * 2) / (data.length - 1 || 1);
                
                ctx.beginPath();
                ctx.strokeStyle = colors[0];
                ctx.lineWidth = 3;
                ctx.lineJoin = 'round';
                
                data.forEach((item, i) => {
                    let val = typeof item === 'object' ? item.value : item;
                    let x = padding + i * stepX;
                    let y = height - padding - ((val / maxVal) * (height - padding * 2));
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
            }
        };

        // If config.value or config.data is reactive, subscribe
        if (config.value && typeof config.value.subscribe === 'function') {
            config.value.subscribe(() => {
                requestAnimationFrame(renderChart);
            });
        }
        
        // Initial setup
        setTimeout(() => {
            resizeObserver.observe(container);
            renderChart();
        }, 0);

        return container;
    };
})();
