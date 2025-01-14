#!/bin/bash

# Define the log file
log_file="execution.log"

# Source environment variables
source /etc/backend_scraper_keys/.env

# Function to run Python scripts in parallel using tmux
run_scripts_in_parallel() {
    local script1="$1"
    local script2="$2"

    # Use absolute paths
    local script_dir="/home/ubuntu/backend_scraper_nlp"
    
    # Delete log files if they exist
    rm -f "${script_dir}/log1.log" "${script_dir}/log2.log"

    # Kill existing session if it exists
    tmux kill-session -t "parallel_scripts2" 2>/dev/null || true

    # Start a new tmux session in detached mode
    tmux new-session -d -s "parallel_scripts2" "cd ${script_dir} && python3 $script1 && echo \"\$(date): $script1 completed\" && echo 'completed_flag = 1' > log1.log"
    
    # Create second window in detached mode
    tmux split-window -h -t "parallel_scripts2" "cd ${script_dir} && python3 $script2 && echo \"\$(date): $script2 completed\" && echo 'completed_flag = 1' > log2.log"
    
    # Optional: wait for both processes to complete
    while [ ! -f "${script_dir}/log1.log" ] || [ ! -f "${script_dir}/log2.log" ]; do
        sleep 60
    done
}


# Run scripts in parallel using tmux
run_scripts_in_parallel "new-scraper-annualreports.py" "new-scraper-sustain.py"

# Function to log messages to the execution log
log_message() {
    local message="$1"
    echo "$(date): $message" >> "$log_file"
}

# Check if both scripts have completed in a loop

log_message "Both scripts have completed. Deleting session..."

# Run the sequential scripts
python3 "/home/ubuntu/backend_scraper_nlp/Database KPI/Database KPI 1.0 code.py"
#log_message "2"
python3 "/home/ubuntu/backend_scraper_nlp/Database KPI/Unique Data Table.py"

log_message "Sent KPI and Unique Data Table, Turning off VM"
#kill all chrome processes
killall -9 chrome
# Make a curl request and log the result
curl https://6bjiql6f3x6tgzs2ev66igseti0uzmat.lambda-url.us-east-2.on.aws/ >> "$log_file" 2>&1