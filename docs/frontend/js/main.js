// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        // 为菜单按钮添加点击事件
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // 修改图标类名而不是重新创建元素
            const menuIcon = menuToggle.querySelector('i');
            if (menuIcon) {
                if (mobileMenu.classList.contains('active')) {
                    menuIcon.className = 'fas fa-times';
                } else {
                    menuIcon.className = 'fas fa-bars';
                }
            }
            
            // 添加动画效果
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.style.animation = 'slideIn 0.3s ease';
            }
        });
        
        // 点击菜单链接后关闭菜单
        document.querySelectorAll('.mobile-menu a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // 移动端下拉菜单交互
        document.querySelectorAll('.mobile-dropdown .dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = toggle.closest('.mobile-dropdown');
                dropdown.classList.toggle('active');
            });
        });
        
        // 点击空白区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // 搜索功能
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                const engine = document.querySelector('.search-engine').value;
                // 添加搜索动画
                searchForm.style.opacity = '0.7';
                setTimeout(() => {
                    window.open(engine + encodeURIComponent(query), '_blank');
                    searchForm.style.opacity = '1';
                }, 300);
            }
        });
        
        // 搜索输入框焦点效果
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.transform = 'scale(1.02)';
            searchInput.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.transform = 'scale(1)';
        });
    }
    
    // 返回顶部按钮
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // QQ联系功能
    function chatQQ(number) {
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = "mqqwpa://im/chat?chat_type=wpa&uin=" + number + "&version=1&src_type=web";
        } else {
            window.open('http://wpa.qq.com/msgrd?v=3&uin=' + number + '&site=qq&menu=yes', '_blank');
        }
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // 卡片悬停效果增强
    document.querySelectorAll('.card, .skill-card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 导航栏滚动效果
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                header.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        });
    }
    
    // 音频列表交互功能
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const audioList = document.getElementById('audioList');
    
    if (audioPlayer && audioList) {
        // 获取所有音频列表项
        const audioItems = audioList.querySelectorAll('li');
        
        // 为每个列表项添加点击事件
        audioItems.forEach(item => {
            item.addEventListener('click', () => {
                // 获取音频源路径
                const audioSrc = item.getAttribute('data-src');
                
                // 更新音频播放器的源
                const source = audioPlayer.querySelector('source');
                if (source) {
                    source.src = audioSrc;
                    source.type = 'audio/mpeg';
                }
                
                // 加载并播放音频
                audioPlayer.load();
                
                // 处理播放错误
                audioPlayer.addEventListener('error', function(e) {
                    console.error('音频加载错误:', e);
                    alert('音频加载失败，请检查文件路径是否正确。');
                });
                
                // 尝试播放音频
                audioPlayer.play().catch(error => {
                    console.error('播放失败:', error);
                    // 不强制播放，允许用户手动点击播放按钮
                });
                
                // 更新列表项的激活状态
                audioItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // 为音频播放器添加ended事件，播放结束后移除激活状态
        audioPlayer.addEventListener('ended', () => {
            audioItems.forEach(item => item.classList.remove('active'));
        });
    }
});

// 页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
