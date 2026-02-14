import os

class Config:
    # 基础配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    STATIC_FOLDER = os.path.join(os.path.dirname(__file__), '../../frontend')
    
    # 数据库配置占位(如需)
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    # SQLALCHEMY_TRACK_MODIFICATIONS = False