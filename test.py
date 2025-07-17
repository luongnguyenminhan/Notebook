import time
import threading

import undetected_chromedriver as uc
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
def run_with_timeout(func, args=(), kwargs=None, timeout=15):
    """Run a function in a thread with timeout. Return (success, result/exception)."""
    if kwargs is None:
        kwargs = {}
    result = {}
    def target():
        try:
            result['value'] = func(*args, **kwargs)
            result['success'] = True
        except Exception as e:
            result['value'] = e
            result['success'] = False
    thread = threading.Thread(target=target)
    thread.start()
    thread.join(timeout)
    if thread.is_alive():
        return (False, TimeoutError(f"Function '{func.__name__}' timed out after {timeout} seconds"))
    return (result.get('success', False), result.get('value'))

if __name__ == "__main__":
    print("Starting simple Google Meet test")

try:
    # Set up minimal Chrome options for stability
    print("Setting up Chrome options")
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,720")
    options.add_argument("--use-fake-ui-for-media-stream")
    options.add_argument("--use-fake-device-for-media-stream")  # Block real camera, always use fake
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure,AutofillServerCommunication,InterestCohort,BlockCredentialedSubresources,PopupBlocking,Notifications,Translate,BackgroundTimerThrottling,RendererBackgrounding,DeviceDiscoveryNotifications")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-translate")
    options.add_argument("--disable-background-timer-throttling")
    options.add_argument("--disable-renderer-backgrounding")
    options.add_argument("--disable-device-discovery-notifications")
    options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    # options.add_argument("--headless=new")  # Optional: run headless if needed

    # Initialize undetected Chrome driver
    print("Initializing undetected Chrome driver")
    driver = uc.Chrome(options=options)
    # Stealth: Remove webdriver property
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    try:
        # 1. Vào thẳng Google Meet với timeout
        print("Loading Google Meet page (with timeout)")
        success, result = run_with_timeout(driver.get, args=("https://meet.google.com/shw-jumw-cmv",), timeout=20)
        if not success:
            print(f"❌ driver.get timed out or failed: {result}")
            driver.quit()
            raise Exception(f"driver.get failed: {result}")
        print("Waiting for Google Meet to load...")
        # refresh the browser
        driver.refresh()
        print("Waiting for page to load...")
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        time.sleep(3)
        driver.save_screenshot("./meet_simple_loaded.png")
        print("✓ Screenshot saved: ./meet_simple_loaded.png")

        # 3. Nhập tên
        print("Looking for name input fields...")
        WebDriverWait(driver, 10).until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )
        name_input = None
        inputs = driver.find_elements(By.TAG_NAME, "input")
        for input_elem in inputs:
            placeholder = input_elem.get_attribute("placeholder")
            if placeholder and ("Tên của bạn" in placeholder or "Your name" in placeholder):
                name_input = input_elem
                break
        if name_input:
            print("✓ Found name input field!")
            # Tự động tắt camera và micro (dù trạng thái hiện tại là gì)
            def auto_turn_off(label_off, label_on):
                try:
                    # Nếu đang bật, sẽ có nút "Turn off ..." (tắt đi)
                    btn = driver.find_element(By.XPATH, f"//button[@aria-label='{label_off}' and not(@aria-disabled='true')]")
                    driver.execute_script("arguments[0].click();", btn)
                    print(f"✓ {label_off} - Đã tắt")
                    time.sleep(0.5)
                except Exception:
                    try:
                        # Nếu đã tắt, sẽ có nút "Turn on ..." (không cần click)
                        btn = driver.find_element(By.XPATH, f"//button[@aria-label='{label_on}' and not(@aria-disabled='true')]")
                        print(f"✓ {label_off} - Đã tắt sẵn")
                    except Exception:
                        print(f"(Info) Không tìm thấy nút {label_off} hoặc {label_on}, có thể giao diện chưa load hoặc không có")
            # Tắt camera
            auto_turn_off('Turn off camera', 'Turn on camera')
            # Tắt micro
            auto_turn_off('Turn off microphone', 'Turn on microphone')
            time.sleep(0.5)

            bot_name = "Meeting Bot"
            name_input.clear()
            name_input.send_keys(bot_name)
            print(f"✓ Entered bot name: '{bot_name}'")
            entered_value = name_input.get_attribute("value")
            print(f"✓ Verified entered value: '{entered_value}'")
            # Wait for the join button to be enabled
            try:
                ask_to_join_btn = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[not(@disabled) and (contains(., 'Ask to join') or .//span[contains(text(), 'Ask to join')]) ]"))
                )
                print("✓ 'Ask to join' button is enabled and clickable.")
            except Exception as e:
                print(f"❌ 'Ask to join' button not enabled: {e}")
                ask_to_join_btn = None
        else:
            print("❌ Could not find name input field")
        driver.save_screenshot("./meet_name_entered.png")
        print("✓ Screenshot after entering name saved: ./meet_name_entered.png")


        # 4. Ấn nút "Ask to join" (sau khi đã chắc chắn nút đã enabled)
        print("Looking for 'Ask to join' button...")
        join_clicked = False
        if ask_to_join_btn:
            try:
                driver.execute_script("arguments[0].click();", ask_to_join_btn)
                print("✓ 'Ask to join' button clicked using JavaScript")
                join_clicked = True
                time.sleep(2)
            except Exception as e:
                print(f"❌ Error clicking 'Ask to join' button: {e}")
        if join_clicked:
            print("✓ 'Ask to join' button clicked successfully")
        else:
            print("❌ Could not find or click 'Ask to join' button")
        driver.save_screenshot("./meet_join_clicked.png")
        print("✓ Screenshot after join action saved: ./meet_join_clicked.png")

        print("✓ Google Meet bot join flow completed!")

    finally:
        print("Keeping browser open for 3 seconds...")
        time.sleep(60)

except Exception as e:
    print(f"ERROR: {str(e)}")
    print("Test completed with errors but continuing...")

