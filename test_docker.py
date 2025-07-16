import time
import threading
import os
import sys
import random
import json
import logging

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# --- Thiết lập Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

class GoogleMeetBot:
    """
    Một bot để tự động tham gia Google Meet với các biện pháp chống phát hiện nâng cao.
    """

    def __init__(self, meet_url, bot_name="Guest Bot", headless=True, profile_path="/app/chrome-profile"):
        self.meet_url = meet_url
        self.bot_name = bot_name
        self.headless = headless
        self.profile_path = profile_path
        self.driver = None
        self.start_time = time.time()

        # Tạo các thư mục cần thiết
        os.makedirs("/app/screenshots", exist_ok=True)
        os.makedirs("/app/output", exist_ok=True)

    def _setup_driver(self):
        """Thiết lập các tùy chọn Chrome và khởi tạo driver."""
        logging.info("⚙️  Thiết lập các tùy chọn Chrome...")
        options = uc.ChromeOptions()

        # Tùy chọn cơ bản
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--start-maximized")
        options.add_argument("--window-size=1920,1080")
        
        if self.headless:
            options.add_argument("--headless=new")

        # Tùy chọn media
        options.add_argument("--use-fake-ui-for-media-stream")
        options.add_argument("--use-fake-device-for-media-stream")
        options.add_argument("--autoplay-policy=no-user-gesture-required")
        
        # Tùy chọn chống phát hiện
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-infobars")
        options.add_argument("--disable-popup-blocking")
        options.add_argument("--lang=en-US")
        
        # Sử dụng profile để lưu trữ cookie, giúp phiên làm việc ổn định hơn
        options.add_argument(f"--user-data-dir={self.profile_path}")
        options.add_argument("--profile-directory=Default")
        
        # Thiết lập Preferences
        prefs = {
            "profile.default_content_setting_values.media_stream_mic": 1,
            "profile.default_content_setting_values.media_stream_camera": 1,
            "profile.default_content_setting_values.notifications": 2,
        }
        options.add_experimental_option("prefs", prefs)

        logging.info("🌐  Khởi tạo Chrome driver với undetected_chromedriver...")
        self.driver = uc.Chrome(options=options, version_main=120) # Pin version để ổn định
        self.driver.set_page_load_timeout(60)

    def _apply_stealth_measures(self):
        """Áp dụng các đoạn JS để che giấu các thuộc tính của trình duyệt tự động."""
        logging.info("🥷  Áp dụng các biện pháp tàng hình nâng cao...")
        stealth_script = """
            // Vô hiệu hóa thuộc tính webdriver
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            // Giả mạo plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [
                    { description: 'Portable Document Format', filename: 'internal-pdf-viewer', name: 'Chrome PDF Plugin' },
                    { description: 'WebKit built-in PDF', filename: 'internal-pdf-viewer', name: 'WebKit built-in PDF' },
                ],
            });
            // Giả mạo ngôn ngữ
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            // Giả mạo thông tin WebGL
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) { return 'Intel Open Source Technology Center'; }
                if (parameter === 37446) { return 'Mesa DRI Intel(R) Ivybridge Mobile '; }
                return getParameter(parameter);
            };
            // Giả mạo quyền truy cập
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
            );
        """
        try:
            self.driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
                "source": stealth_script
            })
            logging.info("🥷  Áp dụng JavaScript tàng hình thành công.")
        except Exception as e:
            logging.warning(f"⚠️  Không thể áp dụng JavaScript tàng hình: {e}")

    def _human_like_click(self, element, delay_range=(0.6, 1.2)):
        """Mô phỏng hành động di chuyển chuột và nhấp chuột của con người."""
        action = ActionChains(self.driver)
        action.move_to_element(element).pause(random.uniform(*delay_range)).click().perform()

    def _enter_name(self):
        """Tìm và nhập tên một cách tự nhiên."""
        logging.info("🔍  Tìm kiếm ô nhập tên...")
        try:
            # Sử dụng XPath linh hoạt hơn để tìm ô nhập tên
            name_input_xpath = "//input[@type='text' and (contains(@aria-label, 'name') or contains(@placeholder, 'name'))]"
            name_input = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.XPATH, name_input_xpath))
            )
            logging.info("✅  Đã tìm thấy ô nhập tên.")

            name_input.clear()
            logging.info(f"✏️  Nhập tên: '{self.bot_name}'")
            for char in self.bot_name:
                name_input.send_keys(char)
                time.sleep(random.uniform(0.08, 0.25))
            
            self.save_screenshot("name_entered")
            return True
        except TimeoutException:
            logging.error("❌  Không tìm thấy ô nhập tên sau 20 giây. Có thể trang đã thay đổi hoặc bị chặn.")
            return False

    def _mute_mic_and_camera(self):
        """Tắt micro và camera trước khi tham gia."""
        logging.info("🔇  Cố gắng tắt camera và micro...")
        # Sử dụng thuộc tính data-is-muted để xác định trạng thái và hành động
        # Nút này có thể có nhiều trạng thái aria-label khác nhau, nhưng data-* thường ổn định hơn
        media_button_xpath = "//button[@data-is-muted and (contains(@data-tooltip, 'microphone') or contains(@data-tooltip, 'camera'))]"
        try:
            media_buttons = WebDriverWait(self.driver, 15).until(
                EC.presence_of_all_elements_located((By.XPATH, media_button_xpath))
            )
            for button in media_buttons:
                # Nếu nút chưa bị tắt (data-is-muted="false")
                if button.get_attribute("data-is-muted") == "false":
                    device_name = button.get_attribute("data-tooltip")
                    logging.info(f"    -> Tắt '{device_name}'...")
                    self._human_like_click(button)
                    time.sleep(random.uniform(0.5, 1))
            logging.info("✅  Đã kiểm tra và tắt camera/micro nếu cần.")
        except TimeoutException:
            logging.warning("⚠️  Không tìm thấy nút camera/micro. Có thể chúng đã được tắt mặc định.")
        except Exception as e:
            logging.error(f"❌  Lỗi khi tắt camera/micro: {e}")

    def _click_join_button(self):
        """Tìm và nhấp vào nút 'Ask to join' hoặc 'Join now'."""
        logging.info("🚪  Tìm kiếm nút 'Ask to join'/'Join now'...")
        try:
            # XPath này tìm nút chứa span có văn bản mong muốn
            join_button_xpath = "//button[.//span[contains(text(), 'Ask to join') or contains(text(), 'Join now')]]"
            join_button = WebDriverWait(self.driver, 15).until(
                EC.element_to_be_clickable((By.XPATH, join_button_xpath))
            )
            button_text = join_button.text.strip()
            logging.info(f"✅  Đã tìm thấy nút '{button_text}'.")
            
            self._human_like_click(join_button)
            logging.info(f"🚀  Đã nhấp vào nút '{button_text}'!")
            return True
        except TimeoutException:
            logging.error("❌  Không tìm thấy hoặc không thể nhấp vào nút tham gia.")
            return False

    def _check_for_errors(self):
        """Kiểm tra các thông báo lỗi tức thì trên trang."""
        error_messages = [
            "You can't join this video call",
            "Bạn không thể tham gia",
            "The video call has ended"
        ]
        page_source = self.driver.page_source
        for msg in error_messages:
            if msg in page_source:
                logging.error(f"❌  Phát hiện lỗi trên trang: '{msg}'")
                logging.error("💡  Gợi ý: Kiểm tra link meeting, đảm bảo meeting đang hoạt động và cho phép khách tham gia.")
                return True
        return False

    def join_meeting(self):
        """Thực hiện toàn bộ quy trình tham gia cuộc họp."""
        try:
            self._setup_driver()
            self._apply_stealth_measures()

            logging.info(f"📡  Đang tải trang Google Meet: {self.meet_url}")
            self.driver.get(self.meet_url)

            # Chờ trang tải xong
            WebDriverWait(self.driver, 30).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(random.uniform(3, 5)) # Chờ ngẫu nhiên để các script của trang tải xong
            self.save_screenshot("page_loaded")

            if self._check_for_errors():
                raise Exception("Bị chặn hoặc cuộc họp không hợp lệ.")

            self._mute_mic_and_camera()
            time.sleep(random.uniform(1, 2))

            if not self._enter_name():
                raise Exception("Không thể nhập tên người dùng.")
            
            time.sleep(random.uniform(1, 2.5))
            
            if not self._click_join_button():
                raise Exception("Không thể nhấp vào nút tham gia.")
            
            logging.info("⏳  Đang chờ được chấp nhận vào phòng họp...")
            # Chờ tối đa 5 phút để được chấp nhận hoặc phát hiện lỗi
            WebDriverWait(self.driver, 300).until(
                lambda d: "You'll join the call when someone lets you in" not in d.page_source
            )
            
            logging.info("🎉  Bot đã tham gia cuộc họp thành công hoặc đã hết thời gian chờ!")
            self.save_screenshot("final_state_in_meeting")

            # Giữ bot trong cuộc họp trong một khoảng thời gian
            logging.info("Bot sẽ ở lại trong 2 phút trước khi thoát...")
            time.sleep(120)

        except Exception as e:
            logging.error(f"💥  Đã xảy ra lỗi nghiêm trọng trong quá trình thực thi: {e}")
            self.save_screenshot("error_final")
            return False
        finally:
            self.close()
        return True
        
    def save_screenshot(self, name):
        """Lưu ảnh chụp màn hình vào cả hai thư mục screenshots và output."""
        try:
            path = f"/app/screenshots/meet_{name}_{int(time.time())}.png"
            self.driver.save_screenshot(path)
            logging.info(f"📸  Đã lưu ảnh chụp màn hình: {path}")
            
            # Sao chép vào thư mục output
            output_path = f"/app/output/meet_{name}.png"
            import shutil
            shutil.copy(path, output_path)
        except Exception as e:
            logging.warning(f"⚠️  Không thể lưu ảnh chụp màn hình: {e}")

    def close(self):
        """Đóng trình duyệt và báo cáo thời gian hoạt động."""
        if self.driver:
            logging.info("🔚  Đóng trình duyệt...")
            self.driver.quit()
        duration = time.time() - self.start_time
        logging.info(f"🏁  Hoàn tất thực thi. Tổng thời gian: {duration:.2f} giây.")


if __name__ == "__main__":
    # Lấy URL từ biến môi trường hoặc sử dụng URL mặc định
    # Bạn có thể thay đổi link này khi chạy:
    # docker run --env MEET_URL="https://meet.google.com/your-link" your-image-name
    MEET_URL = os.getenv("MEET_URL", "https://meet.google.com/shw-jumw-cmv")
    
    # Đặt tên cho bot
    BOT_NAME = "Assistant Bot"
    
    # Chạy ở chế độ không đầu (headless) trong Docker, đặt là False để debug trên máy local
    HEADLESS_MODE = True

    logging.info(f"🚀  Bắt đầu bot Google Meet cho URL: {MEET_URL}")
    
    bot = GoogleMeetBot(meet_url=MEET_URL, bot_name=BOT_NAME, headless=HEADLESS_MODE)
    success = bot.join_meeting()

    if success:
        logging.info("✅  Quy trình của Bot đã hoàn tất thành công.")
        sys.exit(0)
    else:
        logging.error("❌  Quy trình của Bot đã kết thúc với lỗi.")
        sys.exit(1)