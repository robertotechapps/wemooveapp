package wemoove.app;
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public void onCreate(Bundle savedInstancState){
        super.onCreate(savedInstancState);
        registerPlugin(GoogleAuth.class);
    }
}
