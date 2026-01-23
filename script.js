// Varsayılan çark verileri
const DEFAULT_WHEELS = {
    wheel1: ['ogo', 'mahmut', 'samet', 'yusuf', 'göktuğ', 'hakan', 'osman'],
    wheel2: [
        'astra', 'breach', 'brimstone', 'chamber', 'cypher', 'clove', 'deadlock',
        'fade', 'gekko', 'harbor', 'iso', 'jett', 'kay/o', 'killjoy', 'neon',
        'omen', 'phoenix', 'raze', 'reyna', 'sage', 'skye', 'sova', 'tejo',
        'viper', 'veto', 'vyse', 'waylay', 'yoru'
    ]
};

// Çark sınıfı - her çark için ayrı instance
class Wheel {
    constructor(canvasId, optionsListId, inputId, addBtnId, spinBtnId, resultId, countId, storageKey, verticalText = false) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.optionsList = document.getElementById(optionsListId);
        this.input = document.getElementById(inputId);
        this.addBtn = document.getElementById(addBtnId);
        this.spinBtn = document.getElementById(spinBtnId);
        this.result = document.getElementById(resultId);
        this.count = document.getElementById(countId);
        this.storageKey = storageKey;
        this.verticalText = verticalText; // For wheel 2, use vertical text
        
        // Wheel properties
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 10;
        this.rotation = 0;
        this.isSpinning = false;
        this.options = [];
        
        // Animation properties with easing
        this.currentRotation = 0;
        this.targetRotation = 0;
        this.startRotation = 0;
        this.animationStartTime = 0;
        this.animationDuration = 0;
        
        // Load from localStorage or use defaults
        this.loadOptions();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
    }
    
    loadOptions() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate that it's an array
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.options = parsed;
                } else {
                    // Geçersiz veri, varsayılanları yükle
                    this.options = [...(DEFAULT_WHEELS[this.storageKey] || [])];
                }
            } else {
                // localStorage boş, varsayılanları yükle
                this.options = [...(DEFAULT_WHEELS[this.storageKey] || [])];
            }
        } catch (e) {
            // Hata durumunda varsayılanları yükle
            this.options = [...(DEFAULT_WHEELS[this.storageKey] || [])];
        }
        
        // İlk çark için: varsayılan verilerin her zaman mevcut olduğundan emin ol
        // Eğer varsayılan verilerden biri eksikse, ekle
        if (this.storageKey === 'wheel1') {
            const defaultOptions = DEFAULT_WHEELS['wheel1'] || [];
            defaultOptions.forEach(defaultOption => {
                if (!this.options.includes(defaultOption)) {
                    this.options.push(defaultOption);
                }
            });
        }
        
        // Her zaman kaydet (varsayılanlar eklendiyse güncelle)
        this.saveOptions();
        this.updateOptionsList();
    }
    
    saveOptions() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.options));
        } catch (e) {
            console.error('Error saving options:', e);
            // Handle storage quota exceeded or other errors
            if (e.name === 'QuotaExceededError') {
                alert('Depolama alanı dolu! Lütfen bazı seçenekleri silin.');
            }
        }
    }
    
    setupEventListeners() {
        this.addBtn.addEventListener('click', () => this.addOption());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addOption();
            }
        });
        this.spinBtn.addEventListener('click', () => this.spin());
    }
    
    addOption() {
        const value = this.input.value.trim();
        
        if (!value) {
            this.input.focus();
            return;
        }
        
        if (this.options.includes(value)) {
            this.input.value = '';
            this.input.focus();
            return;
        }
        
        this.options.push(value);
        this.input.value = '';
        this.saveOptions();
        this.updateOptionsList();
        this.render();
    }
    
    removeOption(index) {
        this.options.splice(index, 1);
        this.saveOptions();
        this.updateOptionsList();
        this.render();
    }
    
    updateOptionsList() {
        this.optionsList.innerHTML = '';
        this.count.textContent = `${this.options.length} ${this.options.length === 1 ? 'seçenek' : 'seçenek'}`;
        
        if (this.options.length === 0) {
            this.optionsList.innerHTML = '<div class="empty-message">Henüz seçenek yok. Hadi bir şeyler ekle! 🎯</div>';
            return;
        }
        
        this.options.forEach((option, index) => {
            const item = document.createElement('div');
            item.className = 'option-item';
            
            const text = document.createElement('span');
            text.className = 'option-text';
            text.textContent = option;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '✕ Sil';
            removeBtn.addEventListener('click', () => this.removeOption(index));
            
            item.appendChild(text);
            item.appendChild(removeBtn);
            this.optionsList.appendChild(item);
        });
    }
    
    calculateFontSize(optionCount) {
        if (optionCount === 0) return 16;
        if (optionCount <= 4) return 24;
        if (optionCount <= 8) return 20;
        if (optionCount <= 12) return 16;
        if (optionCount <= 20) return 14;
        return 12;
    }
    
    render() {
        const ctx = this.ctx;
        const options = this.options;
        
        if (options.length === 0) {
            // Draw empty wheel
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            return;
        }
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const anglePerSlice = (Math.PI * 2) / options.length;
        const fontSize = this.calculateFontSize(options.length);
        const textRadius = this.radius * 0.7; // Position text at 70% of radius
        
        // Color palette for slices
        const colors = [
            '#6366f1', '#818cf8', '#a78bfa', '#c084fc', '#d946ef',
            '#ec4899', '#f43f5e', '#fb7185', '#fb923c', '#fbbf24',
            '#facc15', '#a3e635', '#34d399', '#22d3ee', '#38bdf8',
            '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'
        ];
        
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        // Normalize rotation for rendering (keeps visual rotation in [0, 2π))
        const renderRotation = ((this.currentRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        ctx.rotate(renderRotation);
        
        // Draw slices
        options.forEach((option, index) => {
            const startAngle = index * anglePerSlice - Math.PI / 2;
            const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.radius, startAngle, endAngle);
            ctx.closePath();
            
            const colorIndex = index % colors.length;
            ctx.fillStyle = colors[colorIndex];
            ctx.fill();
            
            // Add subtle border with glow
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Add inner highlight for depth
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.95, startAngle, endAngle);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw text
            ctx.save();
            const textAngle = startAngle + anglePerSlice / 2;
            ctx.rotate(textAngle);
            ctx.translate(textRadius, 0);
            
            if (this.verticalText) {
                // Vertical text for wheel 2 (sütun gibi)
                ctx.rotate(Math.PI / 2); // Rotate to vertical
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw each character vertically
                const chars = option.split('');
                const charHeight = fontSize * 1.2;
                const totalHeight = chars.length * charHeight;
                const startY = -totalHeight / 2 + charHeight / 2;
                
                chars.forEach((char, i) => {
                    ctx.save();
                    ctx.translate(0, startY + i * charHeight);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.fillText(char, 0, 0);
                    ctx.restore();
                });
            } else {
                // Horizontal text for wheel 1
                ctx.rotate(Math.PI / 2); // Rotate text to be readable
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                
                // Calculate max text width to prevent overflow
                const maxWidth = this.radius * 0.5;
                let text = option;
                
                // Measure text and truncate if needed
                let textWidth = ctx.measureText(text).width;
                if (textWidth > maxWidth) {
                    // Truncate text with ellipsis
                    while (textWidth > maxWidth && text.length > 0) {
                        text = text.slice(0, -1);
                        textWidth = ctx.measureText(text + '...').width;
                    }
                    text = text + '...';
                }
                
                // Add text shadow for readability
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                ctx.fillText(text, 0, 0);
            }
            
            ctx.restore();
        });
        
        // Draw center circle with glow effect
        const centerRadius = this.radius * 0.15;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerRadius * 2);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Inner highlight
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        
        ctx.restore();
    }
    
    // Easing function for smooth animation (easeOutCubic)
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    spin() {
        if (this.isSpinning || this.options.length === 0) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.result.textContent = 'Çark dönüyor... 🌀';
        this.result.classList.remove('highlight');
        
        // Random target rotation (4-6 full rotations + random angle for more dramatic effect)
        const fullRotations = 4 + Math.random() * 2;
        const randomAngle = Math.random() * Math.PI * 2;
        this.startRotation = this.currentRotation;
        this.targetRotation = this.currentRotation + (fullRotations * Math.PI * 2) + randomAngle;
        
        // Animation duration (3-4 seconds for smooth effect)
        this.animationDuration = 3000 + Math.random() * 1000;
        this.animationStartTime = performance.now();
        
        this.animate();
    }
    
    animate() {
        if (!this.isSpinning) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1);
        
        if (progress >= 1) {
            // Animation complete
            this.currentRotation = this.targetRotation;
            // Normalize to [0, 2π)
            this.currentRotation = ((this.currentRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
            this.isSpinning = false;
            this.spinBtn.disabled = false;
            this.render();
            this.selectWinner();
            return;
        }
        
        // Apply easing function for smooth deceleration
        const easedProgress = this.easeOutCubic(progress);
        this.currentRotation = this.startRotation + (this.targetRotation - this.startRotation) * easedProgress;
        
        this.render();
        requestAnimationFrame(() => this.animate());
    }
    
    selectWinner() {
        if (this.options.length === 0) return;
        
        const anglePerSlice = (Math.PI * 2) / this.options.length;
        
        // Normalize rotation to [0, 2π)
        let normalizedRotation = ((this.currentRotation % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        
        // Pointer sabit olarak üstte (-π/2)
        // Çark rotation kadar saat yönünde döndü
        // 
        // Slice i'nin açı aralığı (dünya koordinatında, çark döndükten sonra): 
        //   [i * anglePerSlice - π/2 + rotation, (i+1) * anglePerSlice - π/2 + rotation)
        // 
        // Pointer -π/2'de, yani hangi slice'ın içinde?
        // i * anglePerSlice - π/2 + rotation <= -π/2 < (i+1) * anglePerSlice - π/2 + rotation
        // i * anglePerSlice + rotation <= 0 < (i+1) * anglePerSlice + rotation
        // i <= -rotation / anglePerSlice < i+1
        // i = floor(-rotation / anglePerSlice)
        
        // Basit ve doğru formül
        let rawIndex = -normalizedRotation / anglePerSlice;
        let selectedIndex = Math.floor(rawIndex);
        
        // Normalize to [0, options.length)
        selectedIndex = selectedIndex % this.options.length;
        if (selectedIndex < 0) {
            selectedIndex += this.options.length;
        }
        
        // Son güvenlik kontrolü
        if (selectedIndex < 0 || selectedIndex >= this.options.length) {
            selectedIndex = 0;
        }
        
        const winner = this.options[selectedIndex];
        this.result.textContent = `⚡ KAZANAN: ${winner.toUpperCase()} ⚡`;
        this.result.classList.add('highlight');
        
        // Highlight the selected option in the list
        const optionItems = this.optionsList.querySelectorAll('.option-item');
        optionItems.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Remove highlight after animation
        setTimeout(() => {
            this.result.classList.remove('highlight');
        }, 2000);
    }
}

// Initialize wheels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const wheel1 = new Wheel(
            'wheel1',
            'optionsList1',
            'input1',
            'addBtn1',
            'spinBtn1',
            'result1',
            'count1',
            'wheel1'
        );
        
        const wheel2 = new Wheel(
            'wheel2',
            'optionsList2',
            'input2',
            'addBtn2',
            'spinBtn2',
            'result2',
            'count2',
            'wheel2',
            true // verticalText = true for wheel 2
        );
        
        // Make wheels accessible globally for debugging if needed
        window.wheel1 = wheel1;
        window.wheel2 = wheel2;
        
        // PWA desteği için service worker kaydı
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                        // Service worker başarıyla kaydedildi
                    })
                    .catch((error) => {
                        // Service worker kaydı başarısız (offline modda çalışmaya devam eder)
                    });
            });
        }
    } catch (error) {
        console.error('Error initializing wheels:', error);
        alert('Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
});
