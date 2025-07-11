// تطبيق تشفير الملفات - CryptoFiles
// JavaScript الرئيسي

// المتغيرات العامة
let currentLanguage = 'ar';
let currentTheme = 'light';
let selectedFiles = [];
let activatedIPs = [];
let encryptedFiles = [];
let userStats = {
    remainingFiles: 5,
    encryptedFiles: 0,
    subscriptionType: 'free'
};

// الترجمات
const translations = {
    ar: {
        'nav.home': 'الرئيسية',
        'nav.encrypt': 'تشفير الملفات',
        'nav.ipActivation': 'تفعيل IP',
        'nav.settings': 'الإعدادات',
        'encrypt.title': 'تشفير الملفات',
        'encrypt.dragFiles': 'اسحب الملفات هنا أو انقر للتحديد',
        'encrypt.supportedFiles': 'الملفات المدعومة: .lua, .html, .css, .py, .js, .php',
        'encrypt.light': 'خفيف - سريع ومناسب للملفات الصغيرة',
        'encrypt.medium': 'متوسط - توازن بين الأمان والسرعة',
        'encrypt.strong': 'قوي - أقصى مستوى أمان',
        'encrypt.encryptFiles': 'تشفير الملفات',
        'encrypt.remainingFiles': 'ملفات متبقية',
        'ip.title': 'تفعيل عناوين IP',
        'ip.enterIP': 'أدخل عنوان IP (مثال: 192.168.1.1)',
        'ip.addIP': 'إضافة IP',
        'ip.maxIPsInfo': 'يمكنك تفعيل 5 عناوين IP كحد أقصى',
        'common.success': 'نجح',
        'common.error': 'خطأ',
        'common.loading': 'جاري التحميل...',
        'common.save': 'حفظ'
    },
    en: {
        'nav.home': 'Home',
        'nav.encrypt': 'File Encryption',
        'nav.ipActivation': 'IP Activation',
        'nav.settings': 'Settings',
        'encrypt.title': 'File Encryption',
        'encrypt.dragFiles': 'Drag files here or click to select',
        'encrypt.supportedFiles': 'Supported files: .lua, .html, .css, .py, .js, .php',
        'encrypt.light': 'Light - Fast and suitable for small files',
        'encrypt.medium': 'Medium - Balance between security and speed',
        'encrypt.strong': 'Strong - Maximum security level',
        'encrypt.encryptFiles': 'Encrypt Files',
        'encrypt.remainingFiles': 'Remaining Files',
        'ip.title': 'IP Address Activation',
        'ip.enterIP': 'Enter IP Address (example: 192.168.1.1)',
        'ip.addIP': 'Add IP',
        'ip.maxIPsInfo': 'You can activate up to 5 IP addresses',
        'common.success': 'Success',
        'common.error': 'Error',
        'common.loading': 'Loading...',
        'common.save': 'Save'
    },
    zh: {
        'nav.home': '首页',
        'nav.encrypt': '文件加密',
        'nav.ipActivation': 'IP激活',
        'nav.settings': '设置',
        'encrypt.title': '文件加密',
        'encrypt.dragFiles': '将文件拖到这里或点击选择',
        'encrypt.supportedFiles': '支持的文件: .lua, .html, .css, .py, .js, .php',
        'encrypt.light': '轻度 - 快速且适合小文件',
        'encrypt.medium': '中度 - 安全性和速度之间的平衡',
        'encrypt.strong': '强度 - 最高安全级别',
        'encrypt.encryptFiles': '加密文件',
        'encrypt.remainingFiles': '剩余文件',
        'ip.title': 'IP地址激活',
        'ip.enterIP': '输入IP地址（例如：192.168.1.1）',
        'ip.addIP': '添加IP',
        'ip.maxIPsInfo': '您最多可以激活5个IP地址',
        'common.success': '成功',
        'common.error': '错误',
        'common.loading': '加载中...',
        'common.save': '保存'
    },
    ru: {
        'nav.home': 'Главная',
        'nav.encrypt': 'Шифрование файлов',
        'nav.ipActivation': 'Активация IP',
        'nav.settings': 'Настройки',
        'encrypt.title': 'Шифрование файлов',
        'encrypt.dragFiles': 'Перетащите файлы сюда или нажмите для выбора',
        'encrypt.supportedFiles': 'Поддерживаемые файлы: .lua, .html, .css, .py, .js, .php',
        'encrypt.light': 'Легкий - быстрый и подходящий для небольших файлов',
        'encrypt.medium': 'Средний - баланс между безопасностью и скоростью',
        'encrypt.strong': 'Сильный - максимальный уровень безопасности',
        'encrypt.encryptFiles': 'Зашифровать файлы',
        'encrypt.remainingFiles': 'Оставшиеся файлы',
        'ip.title': 'Активация IP-адресов',
        'ip.enterIP': 'Введите IP-адрес (пример: 192.168.1.1)',
        'ip.addIP': 'Добавить IP',
        'ip.maxIPsInfo': 'Вы можете активировать до 5 IP-адресов',
        'common.success': 'Успех',
        'common.error': 'Ошибка',
        'common.loading': 'Загрузка...',
        'common.save': 'Сохранить'
    }
};

// وظائف الترجمة
function t(key) {
    return translations[currentLanguage][key] || key;
}

function updateLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // تحديث النصوص في الصفحة
    updatePageTexts();
    
    // حفظ في localStorage
    localStorage.setItem('language', lang);
}

function updatePageTexts() {
    // تحديث النافذة الرئيسية
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = t(key);
    });
    
    // تحديث العناصر الأخرى
    updateNavigation();
    updateEncryptionSection();
    updateIPActivationSection();
    updateSettingsSection();
}

// إدارة الأقسام
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المحدد
    document.getElementById(sectionId).classList.add('active');
    
    // تحديث الروابط في الشريط العلوي
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

// إدارة الملفات
function initializeFileUpload() {
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const selectedFilesDiv = document.getElementById('selected-files');
    
    // النقر على منطقة الرفع
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // تحديد الملفات
    fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
    });
    
    // سحب وإسقاط الملفات
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        handleFileSelection(e.dataTransfer.files);
    });
}

function handleFileSelection(files) {
    const supportedTypes = ['lua', 'html', 'css', 'py', 'js', 'php'];
    const validFiles = [];
    const invalidFiles = [];
    
    Array.from(files).forEach(file => {
        const extension = file.name.split('.').pop().toLowerCase();
        if (supportedTypes.includes(extension)) {
            validFiles.push(file);
        } else {
            invalidFiles.push(file);
        }
    });
    
    if (invalidFiles.length > 0) {
        showToast('error', t('common.error'), `ملفات غير مدعومة: ${invalidFiles.map(f => f.name).join(', ')}`);
    }
    
    if (validFiles.length > 0) {
        selectedFiles = [...selectedFiles, ...validFiles];
        if (selectedFiles.length > userStats.remainingFiles) {
            selectedFiles = selectedFiles.slice(0, userStats.remainingFiles);
            showToast('error', t('common.error'), 'تم تجاوز الحد الأقصى للملفات');
        }
        updateSelectedFilesList();
    }
}

function updateSelectedFilesList() {
    const selectedFilesDiv = document.getElementById('selected-files');
    
    if (selectedFiles.length === 0) {
        selectedFilesDiv.innerHTML = '';
        return;
    }
    
    selectedFilesDiv.innerHTML = `
        <h4>الملفات المحددة (${selectedFiles.length}):</h4>
        <div class="files-list">
            ${selectedFiles.map((file, index) => `
                <div class="file-item">
                    <div class="file-info">
                        <div class="file-icon">${getFileIcon(file.name)}</div>
                        <div class="file-details">
                            <h4>${file.name}</h4>
                            <small>${formatFileSize(file.size)}</small>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-outline" onclick="removeFile(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateSelectedFilesList();
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        lua: '🌙',
        html: '🌐',
        css: '🎨',
        py: '🐍',
        js: '⚡',
        php: '🐘'
    };
    return icons[ext] || '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// تشفير الملفات
function encryptFiles() {
    if (selectedFiles.length === 0) {
        showToast('error', t('common.error'), 'يرجى تحديد ملفات للتشفير');
        return;
    }
    
    if (selectedFiles.length > userStats.remainingFiles) {
        showToast('error', t('common.error'), 'ليس لديك ملفات متبقية كافية');
        return;
    }
    
    const encryptionLevel = document.querySelector('input[name="encryption-level"]:checked').value;
    const ipProtected = document.getElementById('ip-protected').checked;
    const compressFiles = document.getElementById('compress-files').checked;
    const addExpiration = document.getElementById('add-expiration').checked;
    
    // محاكاة عملية التشفير
    const encryptBtn = document.getElementById('encrypt-btn');
    encryptBtn.disabled = true;
    encryptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + t('common.loading');
    
    setTimeout(() => {
        selectedFiles.forEach(file => {
            const encryptedFile = {
                id: Date.now() + Math.random(),
                originalName: file.name,
                encryptedName: `encrypted_${Date.now()}_${file.name}`,
                fileType: file.name.split('.').pop().toLowerCase(),
                size: file.size,
                encryptionLevel: encryptionLevel,
                ipProtected: ipProtected,
                compressed: compressFiles,
                hasExpiration: addExpiration,
                createdAt: new Date()
            };
            
            encryptedFiles.push(encryptedFile);
        });
        
        // تحديث الإحصائيات
        userStats.remainingFiles -= selectedFiles.length;
        userStats.encryptedFiles += selectedFiles.length;
        
        // مسح الملفات المحددة
        selectedFiles = [];
        updateSelectedFilesList();
        updateStats();
        updateEncryptedFilesList();
        
        // إعادة تفعيل الزر
        encryptBtn.disabled = false;
        encryptBtn.innerHTML = '<i class="fas fa-lock"></i> ' + t('encrypt.encryptFiles');
        
        showToast('success', t('common.success'), 'تم تشفير الملفات بنجاح');
    }, 2000);
}

function updateEncryptedFilesList() {
    const encryptedFilesCard = document.getElementById('encrypted-files-card');
    const encryptedFilesList = document.getElementById('encrypted-files-list');
    
    if (encryptedFiles.length === 0) {
        encryptedFilesCard.style.display = 'none';
        return;
    }
    
    encryptedFilesCard.style.display = 'block';
    encryptedFilesList.innerHTML = encryptedFiles.map(file => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-icon">${getFileIcon(file.originalName)}</div>
                <div class="file-details">
                    <h4>${file.originalName}</h4>
                    <small>${formatFileSize(file.size)} • ${file.createdAt.toLocaleDateString()}</small>
                </div>
            </div>
            <div class="file-actions">
                <span class="badge badge-success">${file.fileType.toUpperCase()}</span>
                <span class="badge ${getEncryptionLevelClass(file.encryptionLevel)}">${file.encryptionLevel}</span>
                ${file.ipProtected ? '<span class="badge badge-danger">IP Protected</span>' : ''}
                <button class="btn btn-outline" onclick="downloadFile(${file.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-outline" onclick="deleteFile(${file.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getEncryptionLevelClass(level) {
    const classes = {
        light: 'badge-success',
        medium: 'badge-warning',
        strong: 'badge-danger'
    };
    return classes[level] || 'badge-secondary';
}

function downloadFile(fileId) {
    const file = encryptedFiles.find(f => f.id === fileId);
    if (file) {
        // محاكاة تحميل الملف
        showToast('info', 'تحميل', `جاري تحميل ${file.originalName}`);
    }
}

function deleteFile(fileId) {
    const index = encryptedFiles.findIndex(f => f.id === fileId);
    if (index !== -1) {
        encryptedFiles.splice(index, 1);
        userStats.encryptedFiles--;
        updateEncryptedFilesList();
        updateStats();
        showToast('success', t('common.success'), 'تم حذف الملف');
    }
}

// إدارة IP
function initializeIPActivation() {
    const addIPBtn = document.getElementById('add-ip-btn');
    const ipInput = document.getElementById('ip-input');
    
    addIPBtn.addEventListener('click', () => {
        const ipAddress = ipInput.value.trim();
        if (ipAddress) {
            addIPAddress(ipAddress);
            ipInput.value = '';
        }
    });
    
    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIPBtn.click();
        }
    });
}

function addIPAddress(ipAddress) {
    if (!isValidIP(ipAddress)) {
        showToast('error', t('common.error'), 'عنوان IP غير صالح');
        return;
    }
    
    if (activatedIPs.some(ip => ip.address === ipAddress)) {
        showToast('error', t('common.error'), 'عنوان IP مفعل بالفعل');
        return;
    }
    
    if (activatedIPs.length >= 5) {
        showToast('error', t('common.error'), 'تم الوصول للحد الأقصى (5 عناوين)');
        return;
    }
    
    const newIP = {
        id: Date.now(),
        address: ipAddress,
        activatedAt: new Date(),
        lastUsed: new Date(),
        status: 'active'
    };
    
    activatedIPs.push(newIP);
    updateActivatedIPsList();
    updateIPProgress();
    showToast('success', t('common.success'), 'تم تفعيل عنوان IP بنجاح');
}

function isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

function updateActivatedIPsList() {
    const activeIPsList = document.getElementById('active-ips-list');
    const activeIPsCount = document.getElementById('active-ips-count');
    
    activeIPsCount.textContent = activatedIPs.length;
    
    if (activatedIPs.length === 0) {
        activeIPsList.innerHTML = `
            <div class="text-center" style="padding: 2rem; color: #6b7280;">
                <i class="fas fa-globe" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>لا توجد عناوين IP مفعلة</p>
            </div>
        `;
        return;
    }
    
    activeIPsList.innerHTML = activatedIPs.map(ip => `
        <div class="ip-item">
            <div class="ip-info">
                <div class="ip-icon">
                    <i class="fas fa-globe"></i>
                </div>
                <div class="ip-details">
                    <h4>${ip.address}</h4>
                    <small>مفعل منذ ${formatTimeAgo(ip.activatedAt)}</small>
                </div>
            </div>
            <div class="ip-actions">
                <span class="badge badge-success">نشط</span>
                <button class="btn btn-outline" onclick="removeIPAddress(${ip.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removeIPAddress(ipId) {
    const index = activatedIPs.findIndex(ip => ip.id === ipId);
    if (index !== -1) {
        activatedIPs.splice(index, 1);
        updateActivatedIPsList();
        updateIPProgress();
        showToast('success', t('common.success'), 'تم إلغاء تفعيل عنوان IP');
    }
}

function updateIPProgress() {
    const progressBar = document.getElementById('ip-progress-bar');
    const percentage = (activatedIPs.length / 5) * 100;
    progressBar.style.width = percentage + '%';
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return 'أقل من ساعة';
    } else if (diffInHours < 24) {
        return `${diffInHours} ساعة`;
    } else {
        const days = Math.floor(diffInHours / 24);
        return `${days} يوم`;
    }
}

// الإعدادات
function initializeSettings() {
    const languageSelector = document.getElementById('settings-language');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const saveBtn = document.getElementById('save-settings-btn');
    
    // تحديد اللغة الحالية
    languageSelector.value = currentLanguage;
    
    // تحديد المظهر الحالي
    themeRadios.forEach(radio => {
        if (radio.value === currentTheme) {
            radio.checked = true;
        }
    });
    
    // حفظ الإعدادات
    saveBtn.addEventListener('click', () => {
        const selectedLanguage = languageSelector.value;
        const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
        
        if (selectedLanguage !== currentLanguage) {
            updateLanguage(selectedLanguage);
        }
        
        if (selectedTheme !== currentTheme) {
            updateTheme(selectedTheme);
        }
        
        showToast('success', t('common.success'), 'تم حفظ الإعدادات بنجاح');
    });
}

function updateTheme(theme) {
    currentTheme = theme;
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        // Auto theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', prefersDark);
    }
    
    localStorage.setItem('theme', theme);
}

// تحديث الإحصائيات
function updateStats() {
    document.getElementById('remaining-files').textContent = userStats.remainingFiles;
    document.getElementById('total-files').textContent = userStats.encryptedFiles;
    document.getElementById('account-remaining').textContent = userStats.remainingFiles;
    
    // تحديث الإحصائيات في الصفحة الرئيسية
    const totalFilesElement = document.getElementById('total-files');
    if (totalFilesElement) {
        totalFilesElement.textContent = userStats.encryptedFiles;
    }
}

// تحديث أقسام الصفحة
function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#home') link.textContent = t('nav.home');
        else if (href === '#encrypt') link.textContent = t('nav.encrypt');
        else if (href === '#ip-activation') link.textContent = t('nav.ipActivation');
        else if (href === '#settings') link.textContent = t('nav.settings');
    });
}

function updateEncryptionSection() {
    const encryptBtn = document.getElementById('encrypt-btn');
    if (encryptBtn && !encryptBtn.disabled) {
        encryptBtn.innerHTML = '<i class="fas fa-lock"></i> ' + t('encrypt.encryptFiles');
    }
}

function updateIPActivationSection() {
    const addIPBtn = document.getElementById('add-ip-btn');
    if (addIPBtn && !addIPBtn.disabled) {
        addIPBtn.innerHTML = '<i class="fas fa-plus"></i> ' + t('ip.addIP');
    }
}

function updateSettingsSection() {
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn && !saveBtn.disabled) {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> ' + t('common.save');
    }
}

// Toast notifications
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     'fa-info-circle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="removeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // إزالة التنبيه تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        removeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

function removeToast(closeBtn) {
    const toast = closeBtn.closest('.toast');
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// إعداد القائمة المحمولة
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// تحميل الإعدادات المحفوظة
function loadSettings() {
    const savedLanguage = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguage && translations[savedLanguage]) {
        updateLanguage(savedLanguage);
    }
    
    if (savedTheme) {
        updateTheme(savedTheme);
    }
}

// تهيئة التطبيق
function initializeApp() {
    // تحميل الإعدادات
    loadSettings();
    
    // تهيئة مكونات التطبيق
    initializeFileUpload();
    initializeIPActivation();
    initializeSettings();
    initializeMobileMenu();
    
    // إعداد الروابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const sectionId = href.replace('#', '');
            showSection(sectionId);
        });
    });
    
    // إعداد زر التشفير
    document.getElementById('encrypt-btn').addEventListener('click', encryptFiles);
    
    // إعداد محدد اللغة
    document.getElementById('language-selector').addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
    
    // تحديث الإحصائيات
    updateStats();
    
    // تحديث النصوص
    updatePageTexts();
    
    // إظهار الصفحة الرئيسية
    showSection('home');
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);

// إضافة تأثيرات خاصة
function addSpecialEffects() {
    // تأثير التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // تأثير الظهور التدريجي للعناصر
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card, .feature-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// إضافة مؤثرات خاصة بعد تحميل الصفحة
window.addEventListener('load', addSpecialEffects);

// إضافة دعم لاختصارات لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 1-4 للتنقل بين الأقسام
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const sections = ['home', 'encrypt', 'ip-activation', 'settings'];
        const sectionIndex = parseInt(e.key) - 1;
        showSection(sections[sectionIndex]);
    }
    
    // Escape لإغلاق التنبيهات
    if (e.key === 'Escape') {
        document.querySelectorAll('.toast').forEach(toast => {
            removeToast(toast.querySelector('.toast-close'));
        });
    }
});

// إضافة دعم للسحب والإفلات في كامل الصفحة
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    // إذا كان في قسم التشفير، التعامل مع الملفات
    if (document.getElementById('encrypt').classList.contains('active')) {
        handleFileSelection(e.dataTransfer.files);
    }
});

// تصدير الوظائف للاستخدام العام
window.CryptoFiles = {
    showSection,
    encryptFiles,
    addIPAddress,
    removeIPAddress,
    removeFile,
    downloadFile,
    deleteFile,
    updateLanguage,
    updateTheme,
    showToast,
    removeToast
};