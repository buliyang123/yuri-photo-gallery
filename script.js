// Yuri点点的魔法相册 ✨
// 阳仔出品，必属精品 */ᐠ｡ꞈ｡ᐟ*

// 数据存储
let photos = JSON.parse(localStorage.getItem('yuriPhotos')) || [];
let currentCategory = 'all';
let currentLayout = 'masonry';
let currentPhotoIndex = 0;
let tempFile = null;

// 分类图标映射
const categoryIcons = {
    'family': '👨‍👩‍👧',
    'travel': '✈️',
    'food': '🍰',
    'pets': '🐱',
    'daily': '🌸'
};

const categoryNames = {
    'family': '家人',
    'travel': '旅行',
    'food': '美食',
    'pets': '萌宠',
    'daily': '日常'
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderGallery();
    setupEventListeners();
    console.log('🌸 Yuri的魔法相册已启动！*/ᐠ｡ꞈ｡ᐟ*');
});

// 创建粒子背景
function createParticles() {
    const container = document.getElementById('particles');
    const icons = ['🌸', '✨', '🎀', '💕', '🌙', '⭐', '🍬', '🦄'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = icons[Math.floor(Math.random() * icons.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// 设置事件监听
function setupEventListeners() {
    // 导航切换
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (view === 'upload') {
                showUpload();
            } else if (view === 'favorites') {
                showFavorites();
            } else {
                showGallery();
            }
        });
    });
    
    // 分类筛选
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderGallery();
        });
    });
    
    // 布局切换
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLayout = btn.dataset.layout;
            const grid = document.getElementById('photoGrid');
            grid.className = 'photo-grid ' + currentLayout;
        });
    });
    
    // 文件上传
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', submitPhoto);
    
    // Lightbox控制
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', showPrevPhoto);
    document.getElementById('lightboxNext').addEventListener('click', showNextPhoto);
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('lightbox').classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevPhoto();
        if (e.key === 'ArrowRight') showNextPhoto();
    });
    
    // 点击遮罩关闭
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });
}

// 处理文件选择
function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
}

// 处理文件
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件哦~ 🌸');
        return;
    }
    
    tempFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.querySelector('.upload-icon').textContent = '✅';
        document.querySelector('.upload-title').textContent = '照片已准备好！';
        document.querySelector('.upload-text').textContent = file.name;
    };
    reader.readAsDataURL(file);
}

// 提交照片
function submitPhoto() {
    if (!tempFile) {
        alert('请先选择一张照片哦~ 📸');
        return;
    }
    
    const title = document.getElementById('photoTitle').value || '美好瞬间';
    const category = document.getElementById('photoCategory').value;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const photo = {
            id: Date.now(),
            title: title,
            category: category,
            src: e.target.result,
            date: new Date().toLocaleDateString('zh-CN'),
            favorite: false
        };
        
        photos.unshift(photo);
        savePhotos();
        renderGallery();
        
        // 重置表单
        tempFile = null;
        document.getElementById('photoTitle').value = '';
        document.querySelector('.upload-icon').textContent = '📸';
        document.querySelector('.upload-title').textContent = '拖拽照片到这里';
        document.querySelector('.upload-text').textContent = '或者点击选择照片';
        
        // 显示成功动画
        showSuccessAnimation();
        
        // 返回画廊
        setTimeout(() => {
            showGallery();
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-view="gallery"]').classList.add('active');
        }, 1000);
    };
    reader.readAsDataURL(tempFile);
}

// 成功动画
function showSuccessAnimation() {
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✨</span> 上传成功！';
    btn.style.background = 'linear-gradient(135deg, #a8e6cf, #7fdbda)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

// 保存照片
function savePhotos() {
    localStorage.setItem('yuriPhotos', JSON.stringify(photos));
}

// 渲染画廊
function renderGallery() {
    const grid = document.getElementById('photoGrid');
    const emptyState = document.getElementById('emptyState');
    const photoCount = document.getElementById('photoCount');
    
    let filteredPhotos = photos;
    if (currentCategory !== 'all') {
        filteredPhotos = photos.filter(p => p.category === currentCategory);
    }
    
    photoCount.textContent = `(${filteredPhotos.length}张)`;
    
    if (filteredPhotos.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    grid.innerHTML = filteredPhotos.map((photo, index) => `
        <div class="photo-card" onclick="openLightbox(${index})" style="animation-delay: ${index * 0.1}s">
            <img class="photo-img" src="${photo.src}" alt="${photo.title}" loading="lazy">
            <div class="photo-info">
                <h3 class="photo-title">${photo.title}</h3>
                <div class="photo-meta">
                    <span class="photo-category">
                        ${categoryIcons[photo.category]} ${categoryNames[photo.category]}
                    </span>
                    <span>${photo.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 显示上传区域
function showUpload() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('gallery').style.display = 'none';
    document.querySelector('.categories').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
}

// 显示画廊
function showGallery() {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('gallery').style.display = 'block';
    document.querySelector('.categories').style.display = 'flex';
    document.querySelector('.hero').style.display = 'block';
    renderGallery();
}

// 显示收藏
function showFavorites() {
    const favPhotos = photos.filter(p => p.favorite);
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('gallery').style.display = 'block';
    document.querySelector('.categories').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    
    // 临时只显示收藏的照片
    const grid = document.getElementById('photoGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (favPhotos.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        emptyState.querySelector('.empty-title').textContent = '还没有收藏哦';
        emptyState.querySelector('.empty-text').textContent = '点击照片可以收藏~';
    } else {
        emptyState.style.display = 'none';
        grid.innerHTML = favPhotos.map((photo, index) => `
            <div class="photo-card" onclick="openLightbox(${photos.indexOf(photo)})" style="animation-delay: ${index * 0.1}s">
                <img class="photo-img" src="${photo.src}" alt="${photo.title}" loading="lazy">
                <div class="photo-info">
                    <h3 class="photo-title">${photo.title}</h3>
                    <div class="photo-meta">
                        <span class="photo-category">
                            ${categoryIcons[photo.category]} ${categoryNames[photo.category]}
                        </span>
                        <span>${photo.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// 打开查看器
function openLightbox(index) {
    let filteredPhotos = photos;
    if (currentCategory !== 'all') {
        filteredPhotos = photos.filter(p => p.category === currentCategory);
    }
    
    currentPhotoIndex = index;
    const photo = filteredPhotos[index];
    
    document.getElementById('lightboxImg').src = photo.src;
    document.getElementById('lightboxTitle').textContent = photo.title;
    document.getElementById('lightboxCategory').textContent = 
        `${categoryIcons[photo.category]} ${categoryNames[photo.category]}`;
    document.getElementById('lightboxDate').textContent = photo.date;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭查看器
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

// 上一张
function showPrevPhoto() {
    let filteredPhotos = photos;
    if (currentCategory !== 'all') {
        filteredPhotos = photos.filter(p => p.category === currentCategory);
    }
    
    currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    const photo = filteredPhotos[currentPhotoIndex];
    
    document.getElementById('lightboxImg').src = photo.src;
    document.getElementById('lightboxTitle').textContent = photo.title;
    document.getElementById('lightboxCategory').textContent = 
        `${categoryIcons[photo.category]} ${categoryNames[photo.category]}`;
    document.getElementById('lightboxDate').textContent = photo.date;
}

// 下一张
function showNextPhoto() {
    let filteredPhotos = photos;
    if (currentCategory !== 'all') {
        filteredPhotos = photos.filter(p => p.category === currentCategory);
    }
    
    currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
    const photo = filteredPhotos[currentPhotoIndex];
    
    document.getElementById('lightboxImg').src = photo.src;
    document.getElementById('lightboxTitle').textContent = photo.title;
    document.getElementById('lightboxCategory').textContent = 
        `${categoryIcons[photo.category]} ${categoryNames[photo.category]}`;
    document.getElementById('lightboxDate').textContent = photo.date;
}
