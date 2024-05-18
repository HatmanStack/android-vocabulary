/**
 * DISCLAIMER:
 * This code is provided for learning purposes only. It is not intended to be production-ready code
 * and may not adhere to best practices or coding standards. The primary goal of this code is to
 * demonstrate concepts and functionality in a working manner.
 *
 * While efforts have been made to ensure the accuracy and functionality of the code, there may be
 * bugs, errors, or inefficiencies present. Use this code at your own risk, and consider it as a
 * starting point for learning and experimentation.
 *
 * This code is provided free of charge and without any warranties or guarantees of any kind. The
 * author and the organization do not assume any responsibility or liability for any damages or
 * losses arising from the use of this code.
 *
 * If you choose to use this code in any capacity, it is highly recommended to review, refactor,
 * and adapt it to meet your specific requirements and coding standards before using it in any
 * production environment.
 */

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
import android.view.inputmethod.InputMethodManager;
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
    public static final String BESTLISTWRONG = "best_list_wrong";
    public static final String BESTLISTHINT = "best_list_hint";
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
    
        // Find the views in the layout
        findViews();
    
        // Initialize a new Random object

    
        // Initialize variables and set initial values
        learnWordsCount = 0;
        indexHolder = 0;
        hintCount = 0;
        wrongCount = 0;
        isAnswerCorrect = true;
        resetListButton.setClickable(false);
    
        // Get shared preferences and retrieve stored values
        sharedPreferences = this.getSharedPreferences("ice_nine.cj.vocabbuilder", MODE_PRIVATE);
        purchaseToken = sharedPreferences.getString("PURCHASE_TOKEN", "");
        workingList = sharedPreferences.getString(WORKING_LIST, "List A");
        progressbarSize = sharedPreferences.getInt(PROGRESSBAR_SIZE, 120);
    
        // Set the progress bar properties
        progressBar.setMax(progressbarSize);
        progressBar.setProgress(getProgressCount(workingList));
    
        // Set the question text to the working list
        questionTextView.setText(workingList);
    
        // Log the progress bar size and current progress count
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
        progressBar = findViewById(R.id.progressBar);
        mRnd = new Random();
    }

    public class Input extends InputMethodService {

        @Override
        public View onCreateInputView() {
            // Creates the input view
            Log.i(TAG, "onCreateInputView: InputView");
            RelativeLayout.LayoutParams hintParams = (RelativeLayout.LayoutParams) fillInTheBlankHintButton.getLayoutParams();
            RelativeLayout.LayoutParams questionParams = (RelativeLayout.LayoutParams) questionTextView.getLayoutParams();
            hintParams.addRule(RelativeLayout.BELOW, Integer.valueOf((int) questionTextView.getY()));
            Log.i(TAG, "onCreateInputView: " + Integer.valueOf((int) questionTextView.getY()));
            return super.onCreateInputView();
        }
    
        @Override
        public void onFinishInputView(boolean finishingInput) {
            // Called when the input view is finished
            super.onFinishInputView(finishingInput);
        }
    }
    
    public void pickWordList(View v) {
        // Picks a word list and updates the UI accordingly
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
    
    public void pickWord() {
        // Picks a word from the vocabulary word list
        wordIndex = mRnd.nextInt(vocabWordList.length);
        while(answered.get(wordIndex) == 3 || (wordIndex == indexHolder && updateProgressBar() < progressBar.getMax() - 3)) {
            wordIndex = mRnd.nextInt(vocabWordList.length);
        }
        indexHolder = wordIndex;
    }
    
    public void askQuestion() {
        // Asks a question by picking a word and determining the question type
        pickWord();
        if (answered.get(wordIndex) == 1) {
            fillInTheBlank();
        } else if (answered.get(wordIndex) == 2) {
            definition();
        } else {
            int random = mRnd.nextInt(2);
            if (random == 1) {
                fillInTheBlank();
            } else {
                definition();
            }
        }
    }

    public void learnWords(View view) {
        // Check if there are more words to learn
        if (learnWordsCount < vocabWordList.length) {
            String word = vocabWordList[learnWordsCount];
            String definition = vocabWordDefinitionList[learnWordsCount];
            questionTextView.setText(word + "\n\n" + definition);
            learnWordsCount++;
        } else {
            // Reset the count when all words have been learned
            learnWordsCount = 0;
        }
    }

    public void fillInTheBlankAnswer(View view) {
        final String answer = vocabWordList[wordIndex];
        String userText = fillInTheBlankEditText.getText().toString().trim();

        InputMethodManager imm = (InputMethodManager) getSystemService(this.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);

        if (!userText.isEmpty()) {
            String[] possibleAnswers = {
                    answer, answer + "d", answer + "ly", answer + "ed",
                    answer + "ing", answer + "s",
                    answer.substring(0, answer.length() - 1) + "es",
                    answer.substring(0, answer.length() - 1) + "ing",
                    answer + "es"
            };

            boolean isCorrect = false;


            for (String possibleAnswer : possibleAnswers) {
                int differenceCount = 0;
                int minLength = Math.min(userText.length(), possibleAnswer.length());

                int i = 0;
                while (i < minLength) {
                    if (userText.charAt(i) != possibleAnswer.charAt(i)) {
                        differenceCount++;
                    }
                    i++;
                }

                if (userText.length() < possibleAnswer.length()) {
                    differenceCount += possibleAnswer.length() - userText.length();
                }
                if(differenceCount < 4){
                    isCorrect = true;
                    break;
                }
            }


            if (isCorrect) {
                result.setText(R.string.correct);
                isAnswerCorrect = true;
                answered.set(wordIndex, answered.get(wordIndex) == 1 ? 3 : 2);
            } else {
                result.setText(R.string.wrong);
                isAnswerCorrect = false;
            }

            resultAnimation();
            answerCheck(2);
        }
    }
    
    public void fillInTheBlank() {
        // Display the fill-in-the-blank question
        questionTextView.setText(fillInTheBlankList[wordIndex]);
        buttonQuestionVisibility(3);
        buttonState(1);
    }
    
    public void definition() {
        // Display the definition question
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
        String text = button.getTag().toString().equals(String.valueOf(randomButton))
                ? vocabWordList[wordIndex]
                : getUniqueIncorrectAnswer();

        button.setText(text);
    }

    private String getUniqueIncorrectAnswer() {
        int index;
        do {
            index = mRnd.nextInt(vocabWordList.length);
        } while (isDuplicateAnswer(index));

        return vocabWordList[index];
    }

    private boolean isDuplicateAnswer(int index) {
        return index == wordIndex ||
                definitionAnswerButton1.getText().equals(vocabWordList[index]) ||
                definitionAnswerButton2.getText().equals(vocabWordList[index]) ||
                definitionAnswerButton3.getText().equals(vocabWordList[index]) ||
                definitionAnswerButton4.getText().equals(vocabWordList[index]);
    }
    
    public void definitionAnswer(View view) {
        // Check if the selected button matches the correct button
        if (view.getTag().toString().equals(String.valueOf(randomButton))) {
            result.setText(R.string.correct);
            // Update answered status based on the current state
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
        // Calculate the total count of answered questions
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
                // Display the definition and word for incorrect answers
                String string = vocabWordDefinitionList[wordIndex] + "\n\n" + vocabWordList[wordIndex];
                questionTextView.setText(string);
            } else {
                // Display the definition, word, and user answer for incorrect fill-in-the-blank answers
                String string = vocabWordDefinitionList[wordIndex] + "\n\n" + vocabWordList[wordIndex] +
                        "\n\n" + fillInTheBlankEditText.getText().toString();
                questionTextView.setText(string);
            }
        } else {
            // Display the current list and check if graduation condition is met
            String string = workingList + " " + subList.toUpperCase();
            questionTextView.setText(string);
            if (updateProgressBar() == progressBar.getMax()) {
                questionBreakView.setVisibility(View.GONE);
                graduation();
            }
        }
    }
    
    public void resultAnimation() {
        // Apply result animation by fading out the result text
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
    
        // Generate graduation message based on hint count and wrong count
        String string;
        if (hintCount <= 1) {
            if (wrongCount <= 1) {
                string = "What's Next Professor?";
            } else {
                string = "You only got " + wrongCount + " Wrong, What's Next?";
            }
        } else {
            string = "You Completed a List with \n" + hintCount + " Hints\n" + wrongCount + " Wrong\n";
        }
    
        // Update all-time wrong and hint counts if necessary

        int allTimeWrong = sharedPreferences.getInt(ALLTIMEWRONG + workingList + subList, -1);
        int allTimeHints = sharedPreferences.getInt(ALLTIMEHINT + workingList + subList, -1);
        int bestlistWrong = sharedPreferences.getInt(BESTLISTWRONG + workingList + subList, -1);
        int bestlistHints = sharedPreferences.getInt(BESTLISTHINT + workingList + subList, -1);
        if(hintCount < bestlistHints){
            allTimeHints += hintCount;
            bestlistHints = hintCount;
            sharedPreferences.edit().putInt(ALLTIMEHINT + workingList + subList, allTimeHints).apply();
            sharedPreferences.edit().putInt(BESTLISTHINT + workingList + subList, hintCount).apply();
        } else if(bestlistHints == -1){
            bestlistHints = hintCount;
            allTimeHints += hintCount;
            sharedPreferences.edit().putInt(ALLTIMEHINT + workingList + subList, allTimeHints).apply();
            sharedPreferences.edit().putInt(BESTLISTHINT + workingList + subList, hintCount).apply();
        }
        if(wrongCount < bestlistWrong){
            allTimeWrong += wrongCount;
            bestlistWrong = wrongCount;
            sharedPreferences.edit().putInt(BESTLISTWRONG + workingList + subList, wrongCount).apply();
            sharedPreferences.edit().putInt(ALLTIMEWRONG + workingList + subList, allTimeWrong).apply();
        } else if(bestlistWrong == -1){
            bestlistWrong = wrongCount;
            allTimeWrong += wrongCount;
            sharedPreferences.edit().putInt(ALLTIMEWRONG + workingList + subList, allTimeWrong).apply();
            sharedPreferences.edit().putInt(BESTLISTWRONG + workingList + subList, wrongCount).apply();
        }
        if (allTimeWrong == -1) {
            allTimeWrong += wrongCount;
            sharedPreferences.edit().putInt(ALLTIMEWRONG + workingList + subList, wrongCount).apply();
        }
        if (allTimeHints == -1) {
            allTimeHints += hintCount;
            sharedPreferences.edit().putInt(ALLTIMEHINT + workingList + subList, hintCount).apply();
        }

    // Compose the final graduation message
    questionTextView.setText("Congratulations You Know Your Vocab\n " + string +
            "\n\nYour Best With this List is\n" + bestlistHints + " Hints\n" +
            bestlistWrong + " Wrong\n\n\n AllTime\n"  + allTimeHints +" Hints\n" + allTimeWrong +" Wrong\n\n" +
            "a Different List? \n Reset and Go Again?");
    sharedPreferences.edit().apply();
    hintCount = 0;
    wrongCount = 0;
}


    /**
 * Check if graduation is required or continue asking questions.
 */
public void graduationCheck(View v) {
    result.setText("");

    if (answered.contains(0) || answered.contains(1) || answered.contains(2)) {
        askQuestion();
    } else {
        graduation();
    }
}

/**
 * Reset the list by setting all answers to 0, resetting hint and wrong counts,
 * and saving the updated values in SharedPreferences.
 */
public void resetList() {
    resetListButton.setVisibility(View.GONE);

    // Reset all answers to 0
    for (int i = 0; i < answered.size(); i++) {
        answered.set(i, 0);
    }

    hintCount = 0;
    wrongCount = 0;

    // Save the updated values in SharedPreferences
    for (int i = 0; i < answered.size(); i++) {
        String identifier = String.valueOf(i);
        sharedPreferences.edit().putInt(workingList + subList + identifier, answered.get(i)).apply();
    }

    sharedPreferences.edit()
            .putInt(HINT + workingList + subList, hintCount)
            .putInt(WRONG + workingList + subList, wrongCount)
            .apply();

    progressBar.setProgress(updateProgressBar());
    askQuestion();
}

/**
 * Adjust the visibility of question-related buttons based on the specified style.
 */
public void buttonQuestionVisibility(int style) {
    if (style == 1) {
        // Style 1: Hide grid layout, fill in the blank view, and reset list button;
        // show question break view
        gridLayout.setVisibility(View.GONE);
        fillInTheBlankView.setVisibility(View.GONE);
        resetListButton.setVisibility(View.GONE);
        questionBreakView.setVisibility(View.VISIBLE);
    } else if (style == 2) {
        // Style 2: Show grid layout; hide fill in the blank view and question break view
        gridLayout.setVisibility(View.VISIBLE);
        fillInTheBlankView.setVisibility(View.GONE);
        questionBreakView.setVisibility(View.GONE);
    } else if (style == 3) {
        // Style 3: Hide grid layout; show fill in the blank view; hide question break view
        gridLayout.setVisibility(View.GONE);
        fillInTheBlankView.setVisibility(View.VISIBLE);
        questionBreakView.setVisibility(View.GONE);
    }
}

/**
 * Animate the button state change based on the specified changeState value.
 */
public void buttonState(int changeState) {
    if (changeState == 1) {
        // Change state 1: Animate fill in the blank elements
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
    } else if (changeState == 2) {
        // Change state 2: Animate grid layout and question text view
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



/**
 * Build the vocab word list, vocab word definition list, and fill in the blank list
 * based on the working list and sub list selected.
 */
public void buildList() {
    String[] workingListArray = getResources().getStringArray(R.array.working_list_array);
    String[] subListArray = getResources().getStringArray(R.array.sub_list_array);
    int startingIndexOfLists = 0;

    // Find the starting index of the lists based on working list and sub list
    for (int i = 0; i < workingListArray.length; i++) {
        if (workingListArray[i].contains(workingList)) {
            startingIndexOfLists = i * 15;

            for (int j = 0; j < subListArray.length; j++) {
                if (subListArray[j].contains(subList)) {
                    int number = j * 3;
                    startingIndexOfLists += number;
                }
            }
        }
    }

    // Retrieve the lists from resources based on the starting index
    vocabWordList = getResources().getStringArray(workingListAddress[startingIndexOfLists]);
    vocabWordDefinitionList = getResources().getStringArray(workingListAddress[startingIndexOfLists + 1]);
    fillInTheBlankList = getResources().getStringArray(workingListAddress[startingIndexOfLists + 2]);

    // Log the length of the vocab word list
    Log.i(TAG, "buildList: " + vocabWordList.length);

    // Load the answered values from SharedPreferences and add them to the answered list
    for (int i = 0; i < vocabWordList.length; i++) {
        Log.i(TAG, "buildList: " + i);

        String identifier = String.valueOf(i);
        answered.add(sharedPreferences.getInt(workingList + subList + identifier, 0));
    }

    // Load hint count and wrong count from SharedPreferences
    hintCount = sharedPreferences.getInt(HINT + workingList + subList, hintCount);
    wrongCount = sharedPreferences.getInt(WRONG + workingList + subList, wrongCount);
}

/**
 * Save the answered list, hint count, wrong count, purchase token, working list,
 * and progress bar size in SharedPreferences when the activity is stopped.
 */
@Override
protected void onStop() {
    super.onStop();

    // Save the answered list in SharedPreferences
    for (int i = 0; i < answered.size(); i++) {
        String identifier = String.valueOf(i);
        sharedPreferences.edit().putInt(workingList + subList + identifier, answered.get(i)).apply();
    }

    // Save hint count, wrong count, purchase token, working list, and progress bar size in SharedPreferences
    sharedPreferences.edit()
            .putInt(HINT + workingList + subList, hintCount)
            .putInt(WRONG + workingList + subList, wrongCount)
            .putString("PURCHASE_TOKEN", purchaseToken)
            .putString(WORKING_LIST, workingList)
            .putInt(PROGRESSBAR_SIZE, progressbarSize)
            .apply();
}

/**
 * Create the options menu and inflate the main menu layout.
 */
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    getMenuInflater().inflate(R.menu.main_menu, menu);
    return true;
}

/**
 * Display the hint for the fill in the blank question and increment the hint count.
 */
public void fillInTheBlankHint(View view) {
    questionTextView.setText(fillInTheBlankList[wordIndex] + "\n\n" + vocabWordDefinitionList[wordIndex]);
    hintCount++;
}

/**
 * Handle the selection of an item in the options menu.
 */
@Override
public boolean onOptionsItemSelected(MenuItem item) {
    buttonQuestionVisibility(1);
    result.setText("");
    String id = item.getTitle().toString();

    // Save the answered list, hint count, and wrong count in SharedPreferences
    for (int i = 0; i < answered.size(); i++) {
        sharedPreferences.edit().putInt(workingList + subList + i, answered.get(i)).apply();
    }
    sharedPreferences.edit()
            .putInt(HINT + workingList + subList, hintCount)
            .putInt(WRONG + workingList + subList, wrongCount)
            .apply();

    // Update the working list, visibility, question text, and progress bar based on the selected item
    workingList = id;
    listPickView.setVisibility(View.VISIBLE);
    questionBreakView.setVisibility(View.GONE);
    questionTextView.setText(workingList);
    answered.clear();
    progressbarSize = 120;

    if (id.equals("A List") || id.equals("B List")) {
        progressbarSize = 150;
    }

    progressBar.setMax(progressbarSize);
    progressBar.setProgress(getProgressCount(id));
    return super.onOptionsItemSelected(item);
}

/**
 * Get the total count of answered questions for a specific working list.
 */
public int getProgressCount(String id) {
    int answeredCount = 0;
    String[] levelList = getResources().getStringArray(R.array.sub_list_array);

    for (int j = 0; j < 5; j++) {
        int size = 10;

        if (id.equals("A List") || id.equals("B List")) {
            size = 8;
        }

        for (int i = 0; i < size; i++) {
            answeredCount += sharedPreferences.getInt(id + levelList[j] + i, 0);
            Log.i(TAG, "getProgressCount: " + levelList[j] + i);
        }
    }

    return answeredCount;
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
