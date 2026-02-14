from flask import Blueprint, send_from_directory
import os

main_bp = Blueprint('main', __name__)

# 获取前端资源目录的绝对路径
frontend_dir = os.path.join(os.path.dirname(__file__), '../../frontend')

@main_bp.route('/')
def serve_index():
    return send_from_directory(frontend_dir, 'index.html')

@main_bp.route('/<path:filename>')
def serve_static(filename):
    # 服务其他静态文件 (CSS, JS等)
    return send_from_directory(frontend_dir, filename)