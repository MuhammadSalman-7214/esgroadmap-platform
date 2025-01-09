#!/bin/bash

# Define the log file
log_file="execution.log"

# Function to run Python scripts in parallel using tmux
run_scripts_in_parallel() {
    local script1="$1"
    local script2="$2"

    # Delete log files if they exist
    rm -f log1.log log2.log

    # Start a new tmux session
    tmux new-session -d -s "parallel_scripts2" \; \
        send-keys "python3 $script1 && echo \"$(date): $script1 completed\" && echo 'completed_flag = 1' > log1.log" C-m \; \
        split-window -h \; \
        send-keys "python3 $script2 && echo \"$(date): $script2 completed\" && echo 'completed_flag = 1' > log2.log" C-m \; \
        attach-session -d \; \
        detach
}

# Run scripts in parallel using tmux
run_scripts_in_parallel "new-scraper-annualreports.py" "new-scraper-sustain.py"

# Function to log messages to the execution log
log_message() {
    local message="$1"
    echo "$(date): $message" >> "$log_file"
}

# Check if both scripts have completed in a loop
while true; do
    if tmux list-sessions | grep -q "parallel_scripts2"; then
        if [[ -f "log1.log" && -f "log2.log" ]]; then
            log_message "Both scripts have completed. Deleting session..."
            #tmux kill-session -t "parallel_scripts2"
            # Change directory to Database KPI
            #cd "Database KPI"
            #log_message "1"
            # Run the sequential scripts
            python3 "/home/ubuntu/backend_scraper_nlp/Database KPI/Database KPI 1.0 code.py"
            #log_message "2"
            python3 "/home/ubuntu/backend_scraper_nlp/Database KPI/Unique Data Table.py"
            
            log_message "Sent KPI and Unique Data Table, Turning off VM"
            tmux kill-session -t "parallel_scripts2"
            break
        else
            log_message "Some scripts have not completed."
        fi
    else
        log_message "Session has been terminated."
        break
    fi
    sleep 1
done

#kill all chrome processes
killall -9 chrome
# Make a curl request and log the result
curl https://6bjiql6f3x6tgzs2ev66igseti0uzmat.lambda-url.us-east-2.on.aws/ >> "$log_file" 2>&1
