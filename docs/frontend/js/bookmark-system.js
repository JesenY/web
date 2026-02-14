// 链接收藏系统
class BookmarkSystem {
    constructor() {
        // 临时清空localStorage以清除无效数据
        try {
            localStorage.clear();
        } catch (error) {
            console.log('Error clearing localStorage:', error);
        }
        this.bookmarks = [];
        this.categories = [
            { id: 'development', name: '开发工具', icon: 'code' },
            { id: 'design', name: '设计灵感', icon: 'paint-brush' },
            { id: 'learning', name: '学习资源', icon: 'graduation-cap' },
            { id: 'entertainment', name: '娱乐休闲', icon: 'gamepad' },
            { id: 'social', name: '社交网络', icon: 'users' }
        ];
        this.currentView = 'grid';
        this.currentCategory = 'all';
        console.log('Constructor called, bookmarks:', this.bookmarks.length);
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderBookmarks();
        this.updateCategoryCounts();
    }

    bindEvents() {
        // 模态框控制
        document.getElementById('addBookmarkBtn').addEventListener('click', () => this.openModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelFormBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('bookmarkForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // 视图切换
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });

        // 分类切换
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.switchCategory(category);
            });
        });

        // 添加分类
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.addCategory());

        // 搜索和过滤
        // 已移除categoryFilter和tagFilter相关事件监听器

        // 导入/导出
        document.getElementById('importBtn').addEventListener('click', () => this.importBookmarks());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportBookmarks());

        // 点击模态框外部关闭
        document.getElementById('addBookmarkModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('addBookmarkModal')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        document.getElementById('addBookmarkModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('addBookmarkModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        document.getElementById('bookmarkForm').reset();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const bookmark = {
            id: Date.now().toString(),
            url: formData.get('url'),
            title: formData.get('title'),
            description: formData.get('description'),
            thumbnail: formData.get('thumbnail') || `https://via.placeholder.com/150`,
            category: formData.get('category'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            createdAt: new Date().toISOString()
        };

        this.bookmarks.push(bookmark);
        this.saveBookmarks();
        this.renderBookmarks();
        this.updateCategoryCounts();
        this.closeModal();
    }

    switchView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        this.renderBookmarks();
    }

    switchCategory(category) {
        this.currentCategory = category;
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.renderBookmarks();
    }

    addCategory() {
        const name = prompt('请输入分类名称:');
        if (name) {
            const id = name.toLowerCase().replace(/\s+/g, '-');
            this.categories.push({ id, name, icon: 'folder' });
            this.saveCategories();
            this.renderCategories();
        }
    }

    filterBookmarks() {
        // 已移除搜索和过滤功能
        this.renderFilteredBookmarks(this.bookmarks);
    }

    renderBookmarks() {
        let filtered = this.bookmarks;
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(bookmark => bookmark.category === this.currentCategory);
        }
        this.renderFilteredBookmarks(filtered);
    }

    renderFilteredBookmarks(bookmarks) {
        const container = document.getElementById('bookmarksGrid');
        container.innerHTML = '';

        console.log('Rendering filtered bookmarks:', bookmarks.length);

        if (bookmarks.length === 0) {
            container.innerHTML = `
                <div class="no-bookmarks">
                    <i class="fas fa-bookmark"></i>
                    <p>暂无链接</p>
                    <small>点击"添加链接"按钮添加您的第一个链接</small>
                </div>
            `;
            return;
        }

        bookmarks.forEach(bookmark => {
            console.log('Rendering bookmark:', bookmark);
            const bookmarkElement = this.createBookmarkElement(bookmark);
            container.appendChild(bookmarkElement);
        });
    }

    createBookmarkElement(bookmark) {
        const div = document.createElement('div');
        div.className = 'bookmark-item';
        div.dataset.category = bookmark.category;
        div.dataset.tags = bookmark.tags.join(',');

        div.innerHTML = `
            <div class="bookmark-thumbnail">
                <img src="${bookmark.thumbnail}" alt="${bookmark.title}">
            </div>
            <div class="bookmark-info">
                <h4 class="bookmark-title">${bookmark.title}</h4>
                <p class="bookmark-description">${bookmark.description || '无描述'}</p>
                <div class="bookmark-meta">
                    <span class="bookmark-url">${(() => {
                        try {
                            return new URL(bookmark.url).hostname;
                        } catch (error) {
                            return bookmark.url;
                        }
                    })()}</span>
                    <div class="bookmark-tags">
                        ${bookmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="bookmark-actions">
                <a href="${bookmark.url}" target="_blank" class="action-btn visit-btn">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <button class="action-btn edit-btn" data-id="${bookmark.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${bookmark.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // 绑定编辑和删除事件
        div.querySelector('.edit-btn').addEventListener('click', () => this.editBookmark(bookmark.id));
        div.querySelector('.delete-btn').addEventListener('click', () => this.deleteBookmark(bookmark.id));

        return div;
    }

    editBookmark(id) {
        const bookmark = this.bookmarks.find(b => b.id === id);
        if (bookmark) {
            document.getElementById('bookmarkUrl').value = bookmark.url;
            document.getElementById('bookmarkTitle').value = bookmark.title;
            document.getElementById('bookmarkDescription').value = bookmark.description;
            document.getElementById('bookmarkThumbnail').value = bookmark.thumbnail;
            document.getElementById('bookmarkCategory').value = bookmark.category;
            document.getElementById('bookmarkTags').value = bookmark.tags.join(', ');
            this.openModal();

            // 修改表单提交行为为更新
            const form = document.getElementById('bookmarkForm');
            const originalSubmit = form.onsubmit;
            form.onsubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                Object.assign(bookmark, {
                    url: formData.get('url'),
                    title: formData.get('title'),
                    description: formData.get('description'),
                    thumbnail: formData.get('thumbnail') || `https://via.placeholder.com/150`,
                    category: formData.get('category'),
                    tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
                });
                this.saveBookmarks();
                this.renderBookmarks();
                this.updateCategoryCounts();
                this.closeModal();
                form.onsubmit = originalSubmit;
            };
        }
    }

    deleteBookmark(id) {
        if (confirm('确定要删除这个链接吗？')) {
            this.bookmarks = this.bookmarks.filter(b => b.id !== id);
            this.saveBookmarks();
            this.renderBookmarks();
            this.updateCategoryCounts();
        }
    }

    updateCategoryCounts() {
        document.querySelectorAll('.category-item').forEach(item => {
            const category = item.dataset.category;
            if (category === 'all') {
                item.querySelector('.category-count').textContent = this.bookmarks.length;
            } else {
                const count = this.bookmarks.filter(b => b.category === category).length;
                item.querySelector('.category-count').textContent = count;
            }
        });
    }

    renderCategories() {
        // 这里可以实现动态渲染分类列表
    }

    importBookmarks() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.json,.csv';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target.result;
                    if (file.name.endsWith('.html')) {
                        this.importFromHTML(content);
                    } else if (file.name.endsWith('.json')) {
                        this.importFromJSON(content);
                    } else if (file.name.endsWith('.csv')) {
                        this.importFromCSV(content);
                    }
                };
                reader.readAsText(file);
            }
        });
        input.click();
    }

    importFromHTML(html) {
        // 简单的HTML书签导入实现
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        links.forEach(link => {
            if (link.href && link.textContent) {
                this.bookmarks.push({
                    id: Date.now().toString() + Math.random(),
                    url: link.href,
                    title: link.textContent,
                    description: '',
                    thumbnail: `https://via.placeholder.com/150`,
                    category: 'all',
                    tags: [],
                    createdAt: new Date().toISOString()
                });
            }
        });
        this.saveBookmarks();
        this.renderBookmarks();
        this.updateCategoryCounts();
        alert('导入成功！');
    }

    importFromJSON(json) {
        try {
            const imported = JSON.parse(json);
            if (Array.isArray(imported)) {
                this.bookmarks = [...this.bookmarks, ...imported];
                this.saveBookmarks();
                this.renderBookmarks();
                this.updateCategoryCounts();
                alert('导入成功！');
            }
        } catch (error) {
            alert('导入失败：无效的JSON文件');
        }
    }

    importFromCSV(csv) {
        // 简单的CSV导入实现
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length > 1) {
                const bookmark = {
                    id: Date.now().toString() + Math.random(),
                    url: values[0],
                    title: values[1],
                    description: values[2] || '',
                    thumbnail: values[3] || `https://via.placeholder.com/150`,
                    category: values[4] || 'all',
                    tags: values[5] ? values[5].split(';') : [],
                    createdAt: new Date().toISOString()
                };
                this.bookmarks.push(bookmark);
            }
        }
        this.saveBookmarks();
        this.renderBookmarks();
        this.updateCategoryCounts();
        alert('导入成功！');
    }

    exportBookmarks() {
        const format = prompt('请选择导出格式：\n1. JSON\n2. CSV');
        if (format === '1') {
            this.exportAsJSON();
        } else if (format === '2') {
            this.exportAsCSV();
        }
    }

    exportAsJSON() {
        const dataStr = JSON.stringify(this.bookmarks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    exportAsCSV() {
        const headers = ['URL', 'Title', 'Description', 'Thumbnail', 'Category', 'Tags', 'Created At'];
        const rows = this.bookmarks.map(bookmark => [
            bookmark.url,
            bookmark.title,
            bookmark.description,
            bookmark.thumbnail,
            bookmark.category,
            bookmark.tags.join(';'),
            bookmark.createdAt
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    saveBookmarks() {
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
    }

    saveCategories() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }
}

// 初始化系统
document.addEventListener('DOMContentLoaded', function() {
    window.bookmarkSystem = new BookmarkSystem();
});
