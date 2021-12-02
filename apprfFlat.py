
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
import tempfile
import matplotlib.pyplot as plt
import numpy as np
import pprint
from sklearn.preprocessing import MinMaxScaler
import json
from sklearn.ensemble import RandomForestClassifier



from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree

def export_dict(clf, feature_names=None):

    """Structure of rules in a fit decision tree classifier
    Parameters
    ----------
    clf : DecisionTreeClassifier
        A tree that has already been fit.
    features, labels : lists of str
        The names of the features and labels, respectively.
    """

    tree = clf.tree_
    if feature_names is None:
        feature_names = range(clf.max_features_)
    
    # Build tree nodes
    tree_nodes = []
    for i in range(tree.node_count):
        if (tree.children_left[i] == tree.children_right[i]):
            tree_nodes.append({"name":"leaf","feat":2, "val":0.1})
           #     clf.classes_[np.argmax(tree.value[i])]
        
        else:
            tree_nodes.append({
                "name": feature_names[tree.feature[i]],
                "val": 0.1,#tree.threshold[i],
                "feat":2,
                "left": tree.children_left[i],
                "right": tree.children_right[i],
            })
    
    #print(tree_nodes)
    # Link tree nodes
    for node in tree_nodes:
        #print(node)
        if node["name"]!="leaf":
            node["children"] = list()
            node["children"].append(tree_nodes[node["left"]])
            node["children"].append(tree_nodes[node["right"]])

    # for node in tree_nodes:
    #     print(node)
    #     if node["name"]!="leaf": 


    #print(tree_nodes[0])

    # Return root node
    return tree_nodes[0]

def export_links():
    # Need to write a function to export n links from each tree
    return True

def export_matrix():
    # Create a matrix that holds data and links
    return True



def add_children(instance):
    instance['children'] = [{"name" : "empty"},{"name": "empty"}]


'''

ruleSetState :   i) A list that tells where zeroes need to be added.
                ii) Set the list empty when passing to the function
               iii) The function will recursively add states to the list
                iv) State 1 : means an empty list needs to be added at that positiion. Ignore State 0
'''

def get_sub_slice(level=[], originalData={}, slice = {}, ruleSetState = []):

    if level:

        l = level.pop()

        # If condition if the slice is empty
        # This is for root node
        #print(ruleSetState)
        #print(slice)
        #print("level " + np.array2string(l))
        if not slice:
            if 'children' in originalData.keys(): 
                newSlice = originalData['children'][l]
                #Keep the previous rule here
                ruleSetState.append(0)
                #print("add 0 to rss at root")
            else:
                # Need to add a column of zeros in ruleSet
                ruleSetState.append(1)
                add_children(slice)
                #print("add 1 to rss at root")
        
        # slice is not empty
        # not root node
        else:
            if 'children' in slice.keys(): 
                newSlice = slice['children'][l]
                #Keep the previous rule here
                ruleSetState.append(0)
                #print("add 0 to rss at not root")
            else:
                add_children(slice)
                newSlice = slice['children'][l]
                 # Need to add a column of zeros in ruleSet
                ruleSetState.append(1)
                #print("add 1 to rss at not root")
                
        get_sub_slice(level=level, originalData=originalData, slice = newSlice, ruleSetState=ruleSetState)
        
    else:
        print("end of iteration")
        return ruleSetState


def print_len(r):
    for key,val in r.items():
        print(key, sum(val))


def get_dataPath(clf,data):

    node_indicator = clf.decision_path(data.data)
    sampleDecisions = []
    for sample_id in range(len(data.data)):
        # obtain ids of the nodes `sample_id` goes through, i.e., row `sample_id`
        # sample_id = 51
        node_index = node_indicator.indices[
            node_indicator.indptr[sample_id] : node_indicator.indptr[sample_id + 1]
        ]

        decisions = [l if l>=0 else 4 for l in clf.tree_.feature[node_index]]

        crunchDecisions = []
        
        for dl in range(len(decisions)):
            if dl==len(decisions)-1:
                break
            else:
                crunchDecisions.append([decisions[dl], decisions[dl+1]])
        
        sampleDecisions.append(crunchDecisions)
        
    return sampleDecisions

import itertools
data = load_iris()
#clf = DecisionTreeClassifier(max_depth=2)
depth = 5
rf = RandomForestClassifier(n_estimators = 10, max_depth=depth, random_state = 14)
rf.fit(data.data, data.target)



rfTrees = []
rfRules = []
rfPaths = []

for clf in rf.estimators_: 
    js = export_dict(clf,feature_names= data.feature_names)

    ruleMatrix = np.array(clf.tree_.decision_path(data.data.astype("float32")).todense()).astype("int")
    rm = ruleMatrix

    ruleJson = {}
    for i in range(1,ruleMatrix.shape[1]):
        ruleJson[i-1] = ruleMatrix[:,i].flatten().tolist()
        
    rfTrees.append(js)
    rfRules.append(ruleJson)
    rfPaths.append(get_dataPath(clf, data.data))