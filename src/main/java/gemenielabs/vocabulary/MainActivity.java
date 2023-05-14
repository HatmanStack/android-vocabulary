package gemenielabs.vocabulary;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.SharedPreferences;
import android.inputmethodservice.InputMethodService;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.Random;

import builder.gemenielabs.vocabulary.R;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "trouble";
    public static final String HINT = "hint";
    public static final String ALLTIMEHINT = "all_time_hint";
    public static final String WRONG = "wrong";
    public static final String ALLTIMEWRONG = "all_time_wrong";
    public static final String WORKING_LIST = "working_list";
    public static final String PROGRESSBAR_SIZE = "progressbar_size";
    public static String[] vocabWordList;
    public static String[] vocabWordDefinitionList;
    public static String[] fillInTheBlankList;
    public ArrayList<Integer> answered = new ArrayList<>();
    int wordIndex;
    Random mRnd;
    EditText fillInTheBlankEditText;
    TextView questionTextView;
    TextView result;
    RelativeLayout fillInTheBlankView;
    RelativeLayout questionBreakView;
    Button fillInTheBlankButton;
    Button definitionAnswerButton1;
    Button definitionAnswerButton2;
    Button definitionAnswerButton3;
    Button definitionAnswerButton4;
    Button nextQuestionButton;
    Button learnWordsButton;
    Button resetListButton;
    Button fillInTheBlankHintButton;
    Button basic;
    Button intermediate;
    Button advanced;
    Button expert;
    Button professional;
    ProgressBar progressBar;
    int learnWordsCount;
    int randomButton;
    GridLayout gridLayout;
    int hintCount = 0;
    int wrongCount = 0;
    int indexHolder;
    int progressbarSize;
    String workingList;
    SharedPreferences sharedPreferences;
    String purchaseToken;
    String subList;
    LinearLayout listPickView;
    boolean isAnswerCorrect;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        progressBar = findViewById(R.id.progressBar);
        mRnd = new Random();
        findViews();
        learnWordsCount = 0;
        indexHolder = 0;
        hintCount = 0;
        wrongCount = 0;
        isAnswerCorrect = true;
        resetListButton.setClickable(false);
        sharedPreferences = this.getSharedPreferences("ice_nine.cj.vocabbuilder", MODE_PRIVATE);
        purchaseToken = sharedPreferences.getString("PURCHASE_TOKEN", "");
        workingList = sharedPreferences.getString(WORKING_LIST, "List A");
        progressbarSize = sharedPreferences.getInt(PROGRESSBAR_SIZE, 120);
        progressBar.setMax(progressbarSize);
        progressBar.setProgress(getProgressCount(workingList));
        questionTextView.setText(workingList);
        Log.i(TAG, "onCreate: " + progressbarSize);
        Log.i(TAG, "onCreate: " + getProgressCount(workingList));
    }


    @Override
    protected void onResume() {
        super.onResume();
        workingList = sharedPreferences.getString(WORKING_LIST, "List A");
        progressbarSize = sharedPreferences.getInt(PROGRESSBAR_SIZE, 120);
        progressBar.setMax(progressbarSize);
        progressBar.setProgress(getProgressCount(workingList));
        questionTextView.setText(workingList);

    }

    public void findViews(){
        basic = findViewById(R.id.basic_button);
        intermediate = findViewById(R.id.intermediate_button);
        advanced = findViewById(R.id.advanced_button);
        expert = findViewById(R.id.expert_button);
        professional = findViewById(R.id.professional_button);
        listPickView = findViewById(R.id.list_pick_view);
        fillInTheBlankEditText = findViewById(R.id.fill_in_the_blank_edit_text);
        questionTextView = findViewById(R.id.fill_in_the_blank_text_view);
        fillInTheBlankButton = findViewById(R.id.fill_in_the_blank_button);
        definitionAnswerButton1 = findViewById(R.id.definition_answer_button_1);
        definitionAnswerButton2 = findViewById(R.id.definition_answer_button_2);
        definitionAnswerButton3 = findViewById(R.id.definition_answer_button_3);
        definitionAnswerButton4 = findViewById(R.id.definition_answer_button_4);
        nextQuestionButton = findViewById(R.id.next_question_button);
        resetListButton = findViewById(R.id.reset_list_button);
        learnWordsButton = findViewById(R.id.learn_words);
        fillInTheBlankHintButton = findViewById(R.id.hint_button);
        gridLayout = findViewById(R.id.grid_layout);
        fillInTheBlankView = findViewById(R.id.fill_in_the_blank_view);
        questionBreakView = findViewById(R.id.question_view);
        result = findViewById(R.id.result);
    }

    public class input extends InputMethodService {

        @Override
        public View onCreateInputView() {

            Log.i(TAG, "onCreateInputView: InputView");
            RelativeLayout.LayoutParams hintParams = (RelativeLayout.LayoutParams) fillInTheBlankHintButton.getLayoutParams();
            RelativeLayout.LayoutParams questionParams = (RelativeLayout.LayoutParams) questionTextView.getLayoutParams();
            hintParams.addRule(RelativeLayout.BELOW, Integer.valueOf((int) questionTextView.getY()));
            Log.i(TAG, "onCreateInputView: " + Integer.valueOf((int) questionTextView.getY()));
            return super.onCreateInputView();
        }

        @Override
        public void onFinishInputView(boolean finishingInput) {
            super.onFinishInputView(finishingInput);
        }
    }

    public void pickWordList(View v) {
        listPickView.setVisibility(View.GONE);
        subList = (String) v.getTag();
        Log.i(TAG, "pickWordList: SubList  " + subList);
        buildList();
        progressbarSize = vocabWordList.length * 3;
        progressBar.setMax(progressbarSize);
        progressBar.setProgress(updateProgressBar());
        String string = workingList + " " + subList.toUpperCase();
        questionTextView.setText(string);
        if(progressBar.getMax() == progressBar.getProgress()){
            graduation();
        } else {
            answerCheck(100);
        }
    }

    public void pickWord () {
        wordIndex = mRnd.nextInt(vocabWordList.length);
        while(answered.get(wordIndex) == 3 || (wordIndex == indexHolder && updateProgressBar() < progressBar.getMax() - 3)) {
            wordIndex = mRnd.nextInt(vocabWordList.length);
        }
        indexHolder = wordIndex;
    }

    public void askQuestion() {
        pickWord();
        if ( answered.get(wordIndex) == 1){
            fillInTheBlank();
        } else if (answered.get(wordIndex) == 2) {
            definition();
        } else {
            int random = mRnd.nextInt(2);
            if (random == 1){
                fillInTheBlank();
            } else {
                definition();
            }
        }
    }

    public void learnWords (View view) {
        if(learnWordsCount < vocabWordList.length) {
            String string = vocabWordList[learnWordsCount] + "\n\n" + vocabWordDefinitionList[learnWordsCount];
            questionTextView.setText(string);
            learnWordsCount++;
        } else {
            learnWordsCount = 0;
        }
    }

    public void fillInTheBlankAnswer(View view) {
        final String answer = vocabWordList[wordIndex];
        if(fillInTheBlankEditText.getText() != null) {
            if (fillInTheBlankEditText.getText().toString().equals(answer) ||
                    fillInTheBlankEditText.getText().toString().equals(answer + "d") ||
                    fillInTheBlankEditText.getText().toString().equals(answer + "ly") ||
                    fillInTheBlankEditText.getText().toString().equals(answer + "ed") ||
                    fillInTheBlankEditText.getText().toString().equals(answer + "ing") ||
                    fillInTheBlankEditText.getText().toString().equals(answer + "s") ||
                    fillInTheBlankEditText.getText().toString().equals(answer.substring(0, answer.length() - 1) + "es") ||
                    fillInTheBlankEditText.getText().toString().equals(answer.substring(0, answer.length() - 1) + "ing") ||
                    fillInTheBlankEditText.getText().toString().equals(answer + "es")    ) {
                result.setText(R.string.correct);
                isAnswerCorrect = true;
                if (answered.get(wordIndex) == 1) {
                    answered.set(wordIndex, 3);
                } else {
                    answered.set(wordIndex, 2);
                }
                isAnswerCorrect = true;
            } else {
                result.setText(R.string.wrong);
                isAnswerCorrect = false;
            }
            resultAnimation();
            answerCheck(2);
        }
    }

    public void fillInTheBlank () {
        questionTextView.setText(fillInTheBlankList[wordIndex]);
        buttonQuestionVisibility(3);
        buttonState(1);
    }

    public void definition() {
        questionTextView.setText(vocabWordDefinitionList[wordIndex]);
        buttonQuestionVisibility(2);
        buttonState(2);
        randomButton = mRnd.nextInt(4);
        setButtonText(definitionAnswerButton1);
        setButtonText(definitionAnswerButton2);
        setButtonText(definitionAnswerButton3);
        setButtonText(definitionAnswerButton4);
    }

    public void setButtonText(Button button) {
        if (button.getTag().toString().equals(String.valueOf(randomButton))) {
            button.setText(vocabWordList[wordIndex]);
        } else {
            int incorrectAnswerIndex = mRnd.nextInt(vocabWordList.length);
            while (definitionAnswerButton1.getText().equals(vocabWordList[incorrectAnswerIndex]) || definitionAnswerButton2.getText().equals(vocabWordList[incorrectAnswerIndex]) ||
                    definitionAnswerButton3.getText().equals(vocabWordList[incorrectAnswerIndex]) || definitionAnswerButton4.getText().equals(vocabWordList[incorrectAnswerIndex]) ||
                    incorrectAnswerIndex == wordIndex) {
                incorrectAnswerIndex = mRnd.nextInt(vocabWordList.length);
            }
            button.setText(vocabWordList[incorrectAnswerIndex]);
        }
    }

    public void definitionAnswer(View view) {
        if(view.getTag().toString().equals(String.valueOf(randomButton))) {
            result.setText(R.string.correct);
            if (answered.get(wordIndex) == 2) {
                answered.set(wordIndex, 3);
            } else {
                answered.set(wordIndex, 1);
            }
            isAnswerCorrect = true;
        } else {
            result.setText(R.string.wrong);
            isAnswerCorrect = false;
        }
        resultAnimation();
        answerCheck(1);
    }

    public int updateProgressBar() {
        int count = 0;
        for (int i = 0; i < answered.size(); i++) {
            count += answered.get(i);
        }
        return count;
    }

    public void answerCheck(int number) {
        buttonQuestionVisibility(1);
        nextQuestionButton.setText(R.string.questions);
        progressBar.setProgress(updateProgressBar());
        if (!isAnswerCorrect) {
            wrongCount++;
            if (number == 1) {
                String string = vocabWordDefinitionList[wordIndex] + "\n\n" + vocabWordList[wordIndex];
                questionTextView.setText(string);
            } else {
                String string = vocabWordDefinitionList[wordIndex] + "\n\n" + vocabWordList[wordIndex] +
                        "\n\n" + fillInTheBlankEditText.getText().toString();
                questionTextView.setText(string);
            }
        } else {
            String string = workingList + " " + subList.toUpperCase();
            questionTextView.setText(string);
            if(updateProgressBar() == progressBar.getMax()) {
                questionBreakView.setVisibility(View.GONE);
                graduation();
            }
        }
    }

    public void resultAnimation () {
        result.setAlpha(1f);
        ObjectAnimator fade = ObjectAnimator.ofFloat(result, "alpha", 0f);
        fade.setDuration(1000);
        fade.start();
    }

    public void graduation() {
        resetListButton.setVisibility(View.VISIBLE);
        resetListButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                resetList();
            }
        });
        String string;
        if ( hintCount <= 1 ) {
            if (wrongCount <= 1) {
                string = "What's Next Professor?";
            } else {
                string = "You only got " + wrongCount + " Wrong , What's Next?";
            }
        } else {
            string = "You Completed a List with \n" + hintCount + " Hints\n" + wrongCount + " Wrong\n";
        }
        int allTimeWrong = sharedPreferences.getInt(ALLTIMEWRONG + workingList + subList, -1);
        int allTimeHints = sharedPreferences.getInt(ALLTIMEHINT + workingList + subList, -1);
        if(allTimeWrong > wrongCount || allTimeWrong == -1) {
            sharedPreferences.edit().putInt(ALLTIMEWRONG + workingList + subList, wrongCount).apply();
            allTimeWrong = wrongCount;
        }
        if(allTimeHints > hintCount || allTimeHints == -1) {
            sharedPreferences.edit().putInt(ALLTIMEHINT + workingList + subList, hintCount).apply();
            allTimeHints = hintCount;
        }
        questionTextView.setText("Congratulations You Know Your Vocab\n " + string + "\n\nYour Best With this List is\n" + allTimeHints + " Hints\n" + allTimeWrong +
                        " Wrong\n\n Try a Different List? \n Reset and Go Again?");
        sharedPreferences.edit().commit();
    }

    public void graduationCheck(View v) {
        result.setText("");
            if (answered.contains(0) || answered.contains(1) || answered.contains(2)) {
                askQuestion();
            } else {
                graduation();
            }
    }

    public void resetList() {
        resetListButton.setVisibility(View.GONE);
        for (int i = 0; i < answered.size(); i++) {
            answered.set(i, 0);
        }
        hintCount = 0;
        wrongCount = 0;
        for (int i = 0; i < answered.size(); i++) {
            String identifier = String.valueOf(i);
            sharedPreferences.edit().putInt(workingList + subList + identifier, answered.get(i)).apply();
        }
        sharedPreferences.edit().putInt(HINT + workingList + subList, hintCount).apply();
        sharedPreferences.edit().putInt(WRONG + workingList + subList, wrongCount).apply();
        progressBar.setProgress(updateProgressBar());
        askQuestion();
    }

    public void buttonQuestionVisibility(int style){
        if(style == 1){
            gridLayout.setVisibility(View.GONE);
            fillInTheBlankView.setVisibility(View.GONE);
            resetListButton.setVisibility(View.GONE);
            questionBreakView.setVisibility(View.VISIBLE);
        }
        if(style == 2){
            gridLayout.setVisibility(View.VISIBLE);
            fillInTheBlankView.setVisibility(View.GONE);
            questionBreakView.setVisibility(View.GONE);
        }
        if(style == 3) {
            gridLayout.setVisibility(View.GONE);
            fillInTheBlankView.setVisibility(View.VISIBLE);
            questionBreakView.setVisibility(View.GONE);
        }
    }

    public void buttonState(int changeState) {
        if(changeState == 1) {
            fillInTheBlankEditText.setX(3000);
            questionTextView.setX(3000);
            fillInTheBlankButton.setX(3000);
            fillInTheBlankHintButton.setX(3000);
            fillInTheBlankEditText.setText("");
            ObjectAnimator animateEditText = ObjectAnimator.ofFloat(fillInTheBlankEditText, "TranslationX", 0f);
            ObjectAnimator animateTextView = ObjectAnimator.ofFloat(questionTextView, "TranslationX", 0f);
            ObjectAnimator animateButton = ObjectAnimator.ofFloat(fillInTheBlankButton, "TranslationX", 0f);
            ObjectAnimator animateHintButton = ObjectAnimator.ofFloat(fillInTheBlankHintButton, "TranslationX", 0f);
            AnimatorSet set = new AnimatorSet();
            set.setDuration(500);
            set.playTogether(animateButton, animateEditText, animateTextView, animateHintButton);
            set.start();
        }
        if (changeState == 2) {
            gridLayout.setY(2000);
            ObjectAnimator animateGrid = ObjectAnimator.ofFloat(gridLayout, "TranslationY", 0f);
            questionTextView.setY(-500);
            ObjectAnimator questionAnimate = ObjectAnimator.ofFloat(questionTextView, "TranslationY", 0f);
            AnimatorSet set = new AnimatorSet();
            set.setDuration(500);
            set.playTogether(animateGrid, questionAnimate);
            set.start();
        }
    }


    public void buildList(){
        String[] workingListArray = getResources().getStringArray(R.array.working_list_array);
        String[] subListArray = getResources().getStringArray(R.array.sub_list_array);
        int startingIndexOfLists = 0;
        for (int i = 0; i < workingListArray.length; i++) {
            if(workingListArray[i].contains(workingList)){
                startingIndexOfLists = i * 15;
                for (int j = 0; j < subListArray.length; j++) {
                    if(subListArray[j].contains(subList)) {

                        int number = j * 3;
                        startingIndexOfLists += number;
                    }
                }
            }
        }
        vocabWordList = getResources().getStringArray(workingListAddress[startingIndexOfLists]);
        vocabWordDefinitionList = getResources().getStringArray(workingListAddress[startingIndexOfLists + 1]);
        fillInTheBlankList = getResources().getStringArray(workingListAddress[startingIndexOfLists + 2]);
        Log.i(TAG, "buildList: " + vocabWordList.length);
        for (int i = 0; i < vocabWordList.length; i++) {
            Log.i(TAG, "buildList: " + i);

            String identifier = String.valueOf(i);
            answered.add(sharedPreferences.getInt(workingList + subList + identifier, 0));
        }

        hintCount = sharedPreferences.getInt(HINT + workingList + subList, hintCount);
        wrongCount = sharedPreferences.getInt(WRONG + workingList + subList, wrongCount);
    }



    @Override
    protected void onStop () {
        super.onStop();
        for (int i = 0; i < answered.size(); i++) {
            String identifier = String.valueOf(i);
            sharedPreferences.edit().putInt(workingList + subList + identifier, answered.get(i)).apply();
        }
        sharedPreferences.edit().putInt(HINT + workingList + subList, hintCount).apply();
        sharedPreferences.edit().putInt(WRONG + workingList + subList, wrongCount).apply();
        sharedPreferences.edit().putString("PURCHASE_TOKEN", purchaseToken).apply();
        sharedPreferences.edit().putString(WORKING_LIST, workingList).apply();
        sharedPreferences.edit().putInt(PROGRESSBAR_SIZE, progressbarSize).apply();
        sharedPreferences.edit().commit();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    public void fillInTheBlankHint (View view) {
        questionTextView.setText(fillInTheBlankList[wordIndex] + "\n\n" + vocabWordDefinitionList[wordIndex]);
        hintCount ++;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        buttonQuestionVisibility(1);
        result.setText("");
        String id = item.getTitle().toString();
        for (int i = 0; i < answered.size(); i++) {
            sharedPreferences.edit().putInt(workingList + subList + i, answered.get(i)).apply();
        }
        sharedPreferences.edit().putInt(HINT + workingList + subList, hintCount).apply();
        sharedPreferences.edit().putInt(WRONG + workingList + subList, wrongCount).apply();
        sharedPreferences.edit().commit();
        workingList = id;
        listPickView.setVisibility(View.VISIBLE);
        questionBreakView.setVisibility(View.GONE);
        questionTextView.setText(workingList);
        answered.clear();
        progressbarSize = 120;
        if(id.equals("A List") || id.equals("B List")) {
            progressbarSize = 150;
        }

        progressBar.setMax(progressbarSize);
        progressBar.setProgress(getProgressCount(id));
        return super.onOptionsItemSelected(item);
    }

    public int getProgressCount(String id){
        int answeredCount = 0;
        String[] levelList = getResources().getStringArray(R.array.sub_list_array);
        for (int j = 0; j < 5 ; j++) {
            int size = 10;
            if(id.equals("A List") || id.equals("B List")) {
                size = 8;
            }
            for (int i = 0; i < size; i++) {
                answeredCount += sharedPreferences.getInt(id + levelList[j] + i, 0);
                Log.i(TAG, "getProgressCount: " + levelList[j] + i);
            }

        }
        return answeredCount ;
    }


    public int[] workingListAddress ={
            R.array.abasicWordList,
            R.array.abasicDefinitionWordList,
            R.array.abasicFillInTheBlank,
            R.array.aintermediateWordList,
            R.array.aintermediateDefinitionWordList,
            R.array.aintermediateFillInTheBlank,
            R.array.aadvancedWordList,
            R.array.aadvancedDefinitionWordList,
            R.array.aadvancedFillInTheBlank,
            R.array.aexpertWordList,
            R.array.aexpertDefinitionWordList,
            R.array.aexpertFillInTheBlank,
            R.array.aprofessionalWordList,
            R.array.aprofessionalDefinitionWordList,
            R.array.aprofessionalFillInTheBlank,
            R.array.bbasicWordList,
            R.array.bbasicDefinitionWordList,
            R.array.bbasicFillInTheBlank,
            R.array.bintermediateWordList,
            R.array.bintermediateDefinitionWordList,
            R.array.bintermediateFillInTheBlank,
            R.array.badvancedWordList,
            R.array.badvancedDefinitionWordList,
            R.array.badvancedFillInTheBlank,
            R.array.bexpertWordList,
            R.array.bexpertDefinitionWordList,
            R.array.bexpertFillInTheBlank,
            R.array.bprofessionalWordList,
            R.array.bprofessionalDefinitionWordList,
            R.array.bprofessionalFillInTheBlank,
            R.array.cbasicWordList,
            R.array.cbasicDefinitionWordList,
            R.array.cbasicFillInTheBlank,
            R.array.cintermediateWordList,
            R.array.cintermediateDefinitionWordList,
            R.array.cintermediateFillInTheBlank,
            R.array.cadvancedWordList,
            R.array.cadvancedDefinitionWordList,
            R.array.cadvancedFillInTheBlank,
            R.array.cexpertWordList,
            R.array.cexpertDefinitionWordList,
            R.array.cexpertFillInTheBlank,
            R.array.cprofessionalWordList,
            R.array.cprofessionalDefinitionWordList,
            R.array.cprofessionalFillInTheBlank,
            R.array.dbasicWordList,
            R.array.dbasicDefinitionWordList,
            R.array.dbasicFillInTheBlank,
            R.array.dintermediateWordList,
            R.array.dintermediateDefinitionWordList,
            R.array.dintermediateFillInTheBlank,
            R.array.dadvancedWordList,
            R.array.dadvancedDefinitionWordList,
            R.array.dadvancedFillInTheBlank,
            R.array.dexpertWordList,
            R.array.dexpertDefinitionWordList,
            R.array.dexpertFillInTheBlank,
            R.array.dprofessionalWordList,
            R.array.dprofessionalDefinitionWordList,
            R.array.dprofessionalFillInTheBlank,
            R.array.ebasicWordList,
            R.array.ebasicDefinitionWordList,
            R.array.ebasicFillInTheBlank,
            R.array.eintermediateWordList,
            R.array.eintermediateDefinitionWordList,
            R.array.eintermediateFillInTheBlank,
            R.array.eadvancedWordList,
            R.array.eadvancedDefinitionWordList,
            R.array.eadvancedFillInTheBlank,
            R.array.eexpertWordList,
            R.array.eexpertDefinitionWordList,
            R.array.eexpertFillInTheBlank,
            R.array.eprofessionalWordList,
            R.array.eprofessionalDefinitionWordList,
            R.array.eprofessionalFillInTheBlank,
            R.array.fbasicWordList,
            R.array.fbasicDefinitionWordList,
            R.array.fbasicFillInTheBlank,
            R.array.fintermediateWordList,
            R.array.fintermediateDefinitionWordList,
            R.array.fintermediateFillInTheBlank,
            R.array.fadvancedWordList,
            R.array.fadvancedDefinitionWordList,
            R.array.fadvancedFillInTheBlank,
            R.array.fexpertWordList,
            R.array.fexpertDefinitionWordList,
            R.array.fexpertFillInTheBlank,
            R.array.fprofessionalWordList,
            R.array.fprofessionalDefinitionWordList,
            R.array.fprofessionalFillInTheBlank,
            R.array.gbasicWordList,
            R.array.gbasicDefinitionWordList,
            R.array.gbasicFillInTheBlank,
            R.array.gintermediateWordList,
            R.array.gintermediateDefinitionWordList,
            R.array.gintermediateFillInTheBlank,
            R.array.gadvancedWordList,
            R.array.gadvancedDefinitionWordList,
            R.array.gadvancedFillInTheBlank,
            R.array.gexpertWordList,
            R.array.gexpertDefinitionWordList,
            R.array.gexpertFillInTheBlank,
            R.array.gprofessionalWordList,
            R.array.gprofessionalDefinitionWordList,
            R.array.gprofessionalFillInTheBlank};

}
